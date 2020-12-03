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
        "alwaysPercentage": False,
        "description": "Il numero di persone ricoverate in ospedale (in terapia intensiva o altro) che sono positive e hanno sintomi covid",
		"short_desc": "di persone positive ricoverate con sintomi"
    }, {
        "name": "Persone in terapia intensiva",
        "db": "Terapia_intensiva",
        "alwaysPercentage": False,
        "description": "Il numero di persone positive ricoverate in terapia intensiva",
		"short_desc": "di persone in terapia intensiva"
    }, {
        "name": "Persone ospedalizzate",
        "db": "Ospedalizzati",
        "alwaysPercentage": False,
        "description": "Il numero di persone positive ricoverate in ospedale (in terapia intensiva o altro) che sono positivi, con o senza sintomi covid",
		"short_desc": "di persone positive ricoverate"
    }, {
        "name": "Persone in isolamento domiciliare",
        "db": "Isolamento_domiciliare",
        "alwaysPercentage": False,
        "description": "Il numero di persone positive ma non gravi, che quindi devono restare isolate per non trasmettere il virus, ma non necessitano dell'ospedale",
		"short_desc": "di persone positive in isolamento"
    }, {
        "name": "Persone positive",
        "db": "Positivi",
        "alwaysPercentage": False,
        "description": "Il numero di persone che le ASL sanno essere positive (quindi quelle che hanno avuto un tampone positivo, e non sono ancora state dichiarate guarite). Attenzione, potrebbe essere molto diverso dal numero reale di persone positive",
		"short_desc": "di persone positive"
    }, {
        "name": "Nuovi positivi scoperti",
        "db": "Nuovi_positivi",
        "alwaysPercentage": False,
        "description": "Il numero di persone risultate positive al tampone",
		"short_desc": "di persone risultate positive al tampone"
    }, {
        "name": "Persone guarite dimesse",
        "db": "Dimessi_guariti",
        "alwaysPercentage": False,
        "description": "Il numero di persone guarite e dimesse dall'ospedale",
		"short_desc": "di persone guarite e dimesse"
    }, {
        "name": "Persone decedute",
        "db": "Deceduti",
        "alwaysPercentage": False,
		"description": "Il numero di persone che sono decedute",
		"short_desc": "di morti"
    }, {
        "name": "Tamponi totali effettuati",
        "db": "Tamponi",
        "alwaysPercentage": False,
        "description": "Il numero di tamponi effettuati: include i \"Primi tamponi\" e i tamponi di controllo",
		"short_desc": "di tamponi totali effettuati"
    }, {
        "name": "Tamponi su persone non note positive",
        "db": "Casi_testati",
        "alwaysPercentage": False,
        "description": "Il numero di \"Primi tamponi\" effettuati, cioè il numero di tamponi non di controllo effettuati",
		"short_desc": "di \"Primi tamponi\""
    }
]
calcReturn = [
    {
        "name": "Percentuale di tamponi positivi",
        "db": "Perc_tamp_pos",
        "alwaysPercentage": True,
        "description": "Quanti tamponi fatti sono risultati positivi?"
    }, {
        "name": "Percentuale di positivi deceduti",
        "db": "Perc_pos_dec",
        "alwaysPercentage": True,
        "description": "Quante persone che sono state testate positive sono morte?"
    }, {
        "name": "Percentuale di positivi ospedalizzati",
        "db": "Perc_pos_osp",
        "alwaysPercentage": True,
        "description": "Quante persone che sono state testate positive sono state ricoverate in ospedale?"
    }, {
        "name": "Percentuale di ospedalizzati in terapia intensiva",
        "db": "Perc_osp_intens",
        "alwaysPercentage": True,
        "description": "Quante persone che sono ricoverate in ospedale sono in terapia intensiva?"
    }, {
        "name": "Percentuale di positivi non ospedalizzati",
        "db": "Perc_pos_isolam",
        "alwaysPercentage": True,
        "description": "Quante persone che sono positive non necessitano di essere ricoverate in ospedale?"
    }
]
allReturn = directReturn + calcReturn

directReturnKeys = list(map(getNameOfObj, directReturn))
calcReturnKeys = list(map(getNameOfObj, calcReturn))


##
#   All the functions to calculate the values of calcReturn
#

def Perc_tamp_pos(fromDate, toDate, table, tamponi, positivi):
    tamponi = tamponi if tamponi else getParamFromQuery("Casi_testati", fromDate, toDate, "STORICO", False)
    positivi = positivi if positivi else getParamFromQuery("Nuovi_positivi", fromDate, toDate, "STORICO", False)
    if table == "VARIAZIONE":
        result = Perc_tamp_pos(fromDate, toDate, "STORICO", tamponi, positivi)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data":
                    result[i][region] = result[i][region] - result[i-1][region]
        for region in result[0].keys():
            if region != "data":
                result[0][region] = 0
    else:
        result = []
        for i in range(len(tamponi)):
            dateItem = {"data": tamponi[i]["data"]}
            for region in tamponi[i].keys():
                if region != "data":
                    dateItem[region] = 100 * positivi[i][region] / tamponi[i][region] if tamponi[i][region] != 0 else 0
            result.append(dateItem)
    return result


def Perc_pos_dec(fromDate, toDate, table, deceduti, positivi):
    deceduti = deceduti if deceduti else getParamFromQuery("Deceduti", fromDate, toDate, "STORICO", False)
    positivi = positivi if positivi else getParamFromQuery("Positivi", fromDate, toDate, "STORICO", False)
    if table == "VARIAZIONE":
        result = Perc_pos_dec(fromDate, toDate, "STORICO", deceduti, positivi)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data":
                    result[i][region] = result[i][region] - result[i-1][region]
        for region in result[0].keys():
            if region != "data":
                result[0][region] = 0
    else:
        result = []
        for i in range(len(deceduti)):
            dateItem = {"data": deceduti[i]["data"]}
            for region in deceduti[i].keys():
                if region != "data":
                    dateItem[region] = 100 * deceduti[i][region] / positivi[i][region] if positivi[i][region] != 0 else 0
            result.append(dateItem)
    return result


def Perc_pos_osp(fromDate, toDate, table, ospedalizzati, positivi):
    ospedalizzati = ospedalizzati if ospedalizzati else getParamFromQuery("Ospedalizzati", fromDate, toDate, "STORICO", False)
    positivi = positivi if positivi else getParamFromQuery("Positivi", fromDate, toDate, "STORICO", False)
    if table == "VARIAZIONE":
        result = Perc_pos_osp(fromDate, toDate, "STORICO", ospedalizzati, positivi)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data":
                    result[i][region] = result[i][region] - result[i-1][region]
        for region in result[0].keys():
            if region != "data":
                result[0][region] = 0
    else:
        result = []
        for i in range(len(ospedalizzati)):
            dateItem = {"data": ospedalizzati[i]["data"]}
            for region in ospedalizzati[i].keys():
                if region != "data":
                    dateItem[region] = 100 * ospedalizzati[i][region] / positivi[i][region] if positivi[i][region] != 0 else 0
            result.append(dateItem)
    return result


def Perc_pos_intens(fromDate, toDate, table, ospedalizzati, terapia_intensiva):
    ospedalizzati = ospedalizzati if ospedalizzati else getParamFromQuery("Ospedalizzati", fromDate, toDate, "STORICO", False)
    terapia_intensiva = terapia_intensiva if terapia_intensiva else getParamFromQuery("Terapia_intensiva", fromDate, toDate, "STORICO", False)
    if table == "VARIAZIONE":
        result = Perc_pos_intens(fromDate, toDate, "STORICO", ospedalizzati, terapia_intensiva)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data":
                    result[i][region] = result[i][region] - result[i-1][region]
        for region in result[0].keys():
            if region != "data":
                result[0][region] = 0
    else:
        result = []
        for i in range(len(ospedalizzati)):
            dateItem = {"data": ospedalizzati[i]["data"]}
            for region in ospedalizzati[i].keys():
                if region != "data":
                    dateItem[region] = 100 * terapia_intensiva[i][region] / ospedalizzati[i][region] if ospedalizzati[i][region] != 0 else 0
            result.append(dateItem)
    return result


def Perc_pos_isolam(fromDate, toDate, table, positivi, isolamento):
    positivi = positivi if positivi else getParamFromQuery("positivi", fromDate, toDate, "STORICO", False)
    isolamento = isolamento if isolamento else getParamFromQuery("Isolamento_domiciliare", fromDate, toDate, "STORICO", False)
    if table == "VARIAZIONE":
        result = Perc_pos_isolam(fromDate, toDate, "STORICO", positivi, isolamento)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data":
                    result[i][region] = result[i][region] - result[i-1][region]
        for region in result[0].keys():
            if region != "data":
                result[0][region] = 0
    else:
        result = []
        for i in range(len(positivi)):
            dateItem = {"data": positivi[i]["data"]}
            for region in positivi[i].keys():
                if region != "data":
                    dateItem[region] = 100 * isolamento[i][region] / positivi[i][region] if positivi[i][region] != 0 else 0
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
                if perc or table=="VARIAZIONE": resultObj[param] = Perc_tamp_pos(fromDate, toDate, table, None, None)
                else: resultObj[param] = Perc_tamp_pos(fromDate, toDate, table, resultObj.get("Casi_testati"), resultObj.get("Nuovi_positivi"))

            elif param == "Perc_pos_dec":
                if perc or table=="VARIAZIONE": resultObj[param] = Perc_pos_dec(fromDate, toDate, table, None, None)
                else: resultObj[param] = Perc_pos_dec(fromDate, toDate, table, resultObj.get("Deceduti"), resultObj.get("Positivi"))

            elif param == "Perc_pos_osp":
                if perc or table=="VARIAZIONE": resultObj[param] = Perc_pos_osp(fromDate, toDate, table, None, None)
                else: resultObj[param] = Perc_pos_osp(fromDate, toDate, table, resultObj.get("Ospedalizzati"), resultObj.get("Positivi"))

            elif param == "Perc_osp_intens":
                if perc or table=="VARIAZIONE": resultObj[param] = Perc_pos_intens(fromDate, toDate, table, None, None)
                else: resultObj[param] = Perc_pos_intens(fromDate, toDate, table, resultObj.get("Ospedalizzati"), resultObj.get("Terapia_intensiva"))

            elif param == "Perc_pos_isolam":
                if perc or table=="VARIAZIONE": resultObj[param] = Perc_pos_isolam(fromDate, toDate, table, None, None)
                else: resultObj[param] = Perc_pos_isolam(fromDate, toDate, table, resultObj.get("Positivi"), resultObj.get("Isolamento_domiciliare"))

        return resultObj

    except Exception as e:
        print(f"Error: {e}")
        return "error"


if __name__ == "__main__":
    app.run(host="localhost", port=3001, debug=False)
    print(f"{get_date()}\t[LOG]\tStarting server")
