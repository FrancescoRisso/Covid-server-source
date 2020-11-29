from flask import Flask        # to be installed
from flask import request
import logging
import mysql.connector
from date import get_date

##
#   Disable default flask logger
#

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

##
#   Function that returns the array containing all the data of a certain parameter
#   The return is already formatted to be ready to be returned to the website
#


def getParamFromQuery(param, fromDate, toDate, table, perc):
    query = f"SELECT Data, Regione, {param} FROM {table}"
    if fromDate and toDate:
        query = f"{query} WHERE Data >= '{fromDate}' AND Data <= '{toDate}'"
    elif fromDate:
        query = f"{query} WHERE Data >= '{fromDate}'"
    elif toDate:
        query = f"{query} WHERE Data <= '{toDate}'"

    query = f"{query} ORDER BY Data"

    reader.execute(query)
    result = reader.fetchall()

    date = result[0][0]
    thisDate = {
        "data": date.strftime("%Y-%m-%d")
    }
    paramReturn = []

    for i in range(len(result)):
        if result[i][0] == date:
            if perc:
                thisDate[result[i][1]] = round(
                    result[i][2] * 100 / population[result[i][1]], 4)
            else:
                thisDate[result[i][1]] = result[i][2]
        else:
            date = result[i][0]
            paramReturn.append(thisDate)
            if perc:
                thisDate = {
                    "data": date.strftime("%Y-%m-%d"),
                    result[i][1]: round(
                        result[i][2] * 100 / population[result[i][1]], 4)
                }
            else:
                thisDate = {
                    "data": date.strftime("%Y-%m-%d"),
                    result[i][1]: result[i][2]
                }

    paramReturn.append(thisDate)
    return paramReturn


##
#   Pick the number of inhabitants per region to calculate percentages
#

population = {
    "Lombardia": 10103969,
    "Lazio": 5865544,
    "Campania": 5785861,
    "Sicilia": 4968410,
    "Veneto": 4907704,
    "Emilia-Romagna": 4467118,
    "Piemonte": 4341375,
    "Puglia": 4008296,
    "Toscana": 3722729,
    "Calabria": 1924701,
    "Sardegna": 1630474,
    "Liguria": 1543127,
    "Marche": 1518400,
    "Abruzzo": 1305770,
    "Friuli-Venezia-Giulia": 1211357,
    "Trentino-Alto-Adige": 1074819,
    "Umbria": 880285,
    "Basilicata": 556934,
    "Molise": 302265,
    "Valle-d_Aosta": 125501,
    "Italia": 60234639
}


##
#   Here are all the list of parameters that we can return:
#       - directReturn are the ones we can get directly from the database
#       - calcReturn are the ones we need to calculate
#       - allReturn is the union of the two above
#   They are saved as dicts with the human-readable name, and the database name
#

def getNameOfObj(obj):
    return obj["db"]


def getFormulaOfObj(obj):
    return obj["formula"]


directReturn = [
    {
        "name": "Ricoverati con sintomi",
        "db": "Ricoverati_con_sintomi",
        "alwaysPercentage": False
    }, {
        "name": "Persone in terapia intensiva",
        "db": "Terapia_intensiva",
        "alwaysPercentage": False
    }, {
        "name": "Persone ospedalizzate",
        "db": "Ospedalizzati",
        "alwaysPercentage": False
    }, {
        "name": "Persone in isolamento domiciliare",
        "db": "Isolamento_domiciliare",
        "alwaysPercentage": False
    }, {
        "name": "Persone positive",
        "db": "Positivi",
        "alwaysPercentage": False
    }, {
        "name": "Nuovi positivi scoperti",
        "db": "Nuovi_positivi",
        "alwaysPercentage": False
    }, {
        "name": "Persone guarite dimesse",
        "db": "Dimessi_guariti",
        "alwaysPercentage": False
    }, {
        "name": "Persone decedute",
        "db": "Deceduti",
        "alwaysPercentage": False
    }, {
        "name": "Tamponi totali effettuati",
        "db": "Tamponi",
        "alwaysPercentage": False
    }, {
        "name": "Tamponi su persone non note positive",
        "db": "Casi_testati",
        "alwaysPercentage": False
    }
]
calcReturn = [{
    "name": "Percentuale di tamponi positivi",
    "db": "Perc_tamp_pos",
    "alwaysPercentage": True
}]
allReturn = directReturn + calcReturn

directReturnKeys = list(map(getNameOfObj, directReturn))
calcReturnKeys = list(map(getNameOfObj, calcReturn))


##
#   All the functions to calculate the values of calcReturn
#

def Perc_tamp_pos(fromDate, toDate, table, tamponi, positivi):
    tamponi = tamponi if tamponi else getParamFromQuery(
        "Casi_testati", fromDate, toDate, table, False)
    positivi = positivi if positivi else getParamFromQuery(
        "Nuovi_positivi", fromDate, toDate, table, False)
    result = []
    for i in range(len(tamponi)):
        dateItem = {"data": tamponi[i]["data"]}
        for region in tamponi[i].keys():
            if region != "data":
                dateItem[region] = 100 * positivi[i][region] / \
                    tamponi[i][region] if tamponi[i][region] != 0 else 0
        result.append(dateItem)
    return result


##
#   Create "server" item from Flask
#
app = Flask(__name__)

##
#   Create an object to be able to comunicate to the database, reader.
#   If there are problems, log and quit
#

conn = None
reader = None


def reloadConn():
    try:
        global conn
        conn = mysql.connector.connect(
            host="192.168.0.2", database="Covid-data", user="prova", password="prova")
        if conn.is_connected():
            print(f"{get_date()}\t[LOG]\tConnected to MySQL database")
        else:
            print(f"Error: error while connecting to the database")
            quit()

        global reader
        reader = conn.cursor()

    except Exception as e:
        print(f"Error: {e}")
        quit()


reloadConn()

##
#   Create response for the GET "/api/raw" request
#


@app.route("/api/raw", methods=["GET"])
def raw():
    if not conn.is_connected():
        reloadConn()

    print(
        f"{get_date()}\t[LOG]\tServing the raw database")
    try:
        values = {
            "data": [],
            "variation": []
        }

        ##
        #   Get all the data from STORICO
        #

        reader.execute("SELECT * FROM STORICO ORDER BY Data")

        fields = [x[0] for x in reader.description][1:]

        for value in reader.fetchall():
            append = {}
            i = 0

            for item in value[1:]:
                append[fields[i]] = item
                i = i+1

            values["data"].append(append)

        ##
        #   Get all the data from VARIATION
        #

        reader.execute("SELECT * FROM VARIAZIONE ORDER BY Data")

        for value in reader.fetchall():
            append = {}
            i = 0

            for item in value[1:]:
                append[fields[i]] = str(item)
                i = i+1

            values["variation"].append(append)

        return values

    except Exception as e:
        print(f"Error: {e}")
        return "error"

##
#   Create response for the GET "/api/fieldlist request
#


@app.route("/api/fieldlist", methods=["GET"])
def fieldList():
    print(f"{get_date()}\t[LOG]\tServing the list of fields")
    return {"list": allReturn}

##
#   Create response for the GET "/api/values request
#


@app.route("/api/values", methods=["GET"])
def values():
    if not conn.is_connected():
        reloadConn()

    try:
        ##
        #   Get all the parameters from the url
        #

        if "from" in request.args:
            fromDate = request.args.get("from")
        else:
            fromDate = False

        if "to" in request.args:
            toDate = request.args.get("to")
        else:
            toDate = False

        if "params" in request.args:
            params = request.args.get("params").split(",")
            print(
                f"{get_date()}\t[LOG]\tServing the fields {params}")
        else:
            return {}
            print(
                f"{get_date()}\t[LOG]\tValues requested, but no fields chosen")

        if "table" in request.args:
            table = request.args.get("table")
        else:
            return {}

        if "percentage" in request.args:
            if request.args.get("percentage") == "true":
                perc = True
            else:
                perc = False
        else:
            perc = False

        resultObj = {}

        for param in params:
            if param in directReturnKeys:
                resultObj[param] = getParamFromQuery(
                    param, fromDate, toDate, table, perc)
            elif param == "Perc_tamp_pos":
                if perc:
                    resultObj[param] = Perc_tamp_pos(
                        fromDate, toDate, table, None, None)
                else:
                    resultObj[param] = Perc_tamp_pos(fromDate, toDate, table, resultObj.get(
                        "Casi_testati"), resultObj.get("Nuovi_positivi"))

        return resultObj

    except Exception as e:
        print(f"Error: {e}")
        return "error"


if __name__ == "__main__":
    app.run(host="localhost", port=3001, debug=False)
    print(f"{get_date()}\t[LOG]\tStarting server")
