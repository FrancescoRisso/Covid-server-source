from flask import Flask        # to be installed
from flask import request
import logging
import mysql.connector
from date import get_date
import numpy as np
from scipy import stats


##
#   Function that returns the array containing all the data of a certain parameter
#   The return is already formatted to be ready to be returned to the website
#

def getParamFromQuery(param, fromDate, toDate, table, perc, smooth):
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
    if table == "VARIAZIONE":
        thisDate["zero"] = 0
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
            if table == "VARIAZIONE":
                thisDate["zero"] = 0

    paramReturn.append(thisDate)
    return smoothGraph(paramReturn) if smooth else paramReturn


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


def isFiniteFloat(num):
    try:
        num = float(num)
        return num == float("inf")
    except Exception:
        return False


directReturn = [
    {
        "name": "Ricoverati con sintomi",
        "db": "Ricoverati_con_sintomi",
                "alwaysPercentage": False,
                "description": "Il numero di persone ricoverate in ospedale, che siano in terapia intensiva o no, che sono positive e hanno sintomi covid",
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
                "description": "Il numero di persone positive ricoverate in ospedale, che siano in terapia intensiva o no, con o senza sintomi covid",
        "short_desc": "di persone positive ricoverate"
    }, {
        "name": "Persone in isolamento domiciliare",
        "db": "Isolamento_domiciliare",
        "alwaysPercentage": False,
                "description": "Il numero di persone positive ma non gravi, che quindi devono restare isolate per non trasmettere il virus, ma non necessitano di essere ricoverate in ospedale",
        "short_desc": "di persone positive in isolamento"
    }, {
        "name": "Persone positive",
        "db": "Positivi",
        "alwaysPercentage": False,
                "description": "Il numero di persone che le ASL sanno essere positive: quelle che hanno avuto un tampone positivo, e non sono ancora state dichiarate guarite. Attenzione, questo dato potrebbe non rispecchiare il numero reale di persone attualmente positive",
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
    }, {
        "name": "Rt",
        "db": "Rt",
        "alwaysPercentage": False,
                "description": "L'inidce di contagio, che indica quante persone infetta in media un contagiato"
    }
]
calcReturn = [
    {
        "name": "Percentuale di tamponi positivi",
        "db": "Perc_tamp_pos",
                "alwaysPercentage": True,
                "description": "Quanti tamponi fatti sono risultati positivi"
    }, {
        "name": "Percentuale di positivi deceduti",
        "db": "Perc_pos_dec",
        "alwaysPercentage": True,
                "description": "Quante persone che sono state testate positive sono morte"
    }, {
        "name": "Percentuale di positivi ospedalizzati",
        "db": "Perc_pos_osp",
        "alwaysPercentage": True,
                "description": "Quante persone che sono state testate positive sono state ricoverate in ospedale"
    }, {
        "name": "Percentuale di ospedalizzati in terapia intensiva",
        "db": "Perc_osp_intens",
        "alwaysPercentage": True,
                "description": "Quante persone che sono ricoverate in ospedale sono in terapia intensiva"
    }, {
        "name": "Percentuale di positivi non ospedalizzati",
        "db": "Perc_pos_isolam",
        "alwaysPercentage": True,
                "description": "Quante persone che sono positive non necessitano di essere ricoverate in ospedale"
    }
]
allReturn = directReturn + calcReturn

directReturnKeys = list(map(getNameOfObj, directReturn))
calcReturnKeys = list(map(getNameOfObj, calcReturn))


##
#   All the functions to calculate the values of calcReturn
#

def Perc_tamp_pos(fromDate, toDate, table, smooth):
    if table == "VARIAZIONE":
        result = Perc_tamp_pos(fromDate, toDate, "STORICO", False)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data" and region != "zero":
                    result[i][region] = result[i][region] - result[i-1][region]
            result[i]["zero"] = 0
        for region in result[0].keys():
            if region != "data" and region != "zero":
                result[0][region] = 0
        result[0]["zero"] = 0
    else:
        tamponi = getParamFromQuery(
            "Casi_testati", fromDate, toDate, "STORICO", False, False)
        positivi = getParamFromQuery(
            "Nuovi_positivi", fromDate, toDate, "STORICO", False, False)
        result = []
        for i in range(len(tamponi)):
            dateItem = {"data": tamponi[i]["data"]}
            for region in tamponi[i].keys():
                if region != "data" and region != "zero":
                    dateItem[region] = 100 * positivi[i][region] / \
                        tamponi[i][region] if tamponi[i][region] != 0 else 0
            result.append(dateItem)
    return smoothGraph(result) if smooth else result


def Perc_pos_dec(fromDate, toDate, table, smooth):
    if table == "VARIAZIONE":
        result = Perc_pos_dec(fromDate, toDate, "STORICO", False)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data" and region != "zero":
                    result[i][region] = result[i][region] - result[i-1][region]
            result[i]["zero"] = 0
        for region in result[0].keys():
            if region != "data" and region != "zero":
                result[0][region] = 0
        result[0]["zero"] = 0
    else:
        deceduti = getParamFromQuery(
            "Deceduti", fromDate, toDate, "STORICO", False, False)
        positivi = getParamFromQuery(
            "Positivi", fromDate, toDate, "STORICO", False, False)
        result = []
        for i in range(len(deceduti)):
            dateItem = {"data": deceduti[i]["data"]}
            for region in deceduti[i].keys():
                if region != "data" and region != "zero":
                    dateItem[region] = 100 * deceduti[i][region] / \
                        positivi[i][region] if positivi[i][region] != 0 else 0
            result.append(dateItem)
    return smoothGraph(result) if smooth else result


def Perc_pos_osp(fromDate, toDate, table, smooth):
    if table == "VARIAZIONE":
        result = Perc_pos_osp(fromDate, toDate, "STORICO", False)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data" and region != "zero":
                    result[i][region] = result[i][region] - result[i-1][region]
            result[i]["zero"] = 0
        for region in result[0].keys():
            if region != "data" and region != "zero":
                result[0][region] = 0
        result[0]["zero"] = 0
    else:
        ospedalizzati = getParamFromQuery(
            "Ospedalizzati", fromDate, toDate, "STORICO", False, False)
        positivi = getParamFromQuery(
            "Positivi", fromDate, toDate, "STORICO", False, False)
        result = []
        for i in range(len(ospedalizzati)):
            dateItem = {"data": ospedalizzati[i]["data"]}
            for region in ospedalizzati[i].keys():
                if region != "data" and region != "zero":
                    dateItem[region] = 100 * ospedalizzati[i][region] / \
                        positivi[i][region] if positivi[i][region] != 0 else 0
            result.append(dateItem)
    return smoothGraph(result) if smooth else result


def Perc_pos_intens(fromDate, toDate, table, smooth):
    if table == "VARIAZIONE":
        result = Perc_pos_intens(fromDate, toDate, "STORICO", False)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data" and region != "zero":
                    result[i][region] = result[i][region] - result[i-1][region]
            result[i]["zero"] = 0
        for region in result[0].keys():
            if region != "data" and region != "zero":
                result[0][region] = 0
        result[0]["zero"] = 0
    else:
        ospedalizzati = getParamFromQuery(
            "Ospedalizzati", fromDate, toDate, "STORICO", False, False)
        terapia_intensiva = getParamFromQuery(
            "Terapia_intensiva", fromDate, toDate, "STORICO", False, False)
        result = []
        for i in range(len(ospedalizzati)):
            dateItem = {"data": ospedalizzati[i]["data"]}
            for region in ospedalizzati[i].keys():
                if region != "data" and region != "zero":
                    dateItem[region] = 100 * terapia_intensiva[i][region] / \
                        ospedalizzati[i][region] if ospedalizzati[i][region] != 0 else 0
            result.append(dateItem)
    return smoothGraph(result) if smooth else result


def Perc_pos_isolam(fromDate, toDate, table, smooth):
    if table == "VARIAZIONE":
        result = Perc_pos_isolam(fromDate, toDate, "STORICO", False)
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data" and region != "zero":
                    result[i][region] = result[i][region] - result[i-1][region]
            result[i]["zero"] = 0
        for region in result[0].keys():
            if region != "data" and region != "zero":
                result[0][region] = 0
        result[0]["zero"] = 0
    else:
        positivi = getParamFromQuery(
            "positivi", fromDate, toDate, "STORICO", False, False)
        isolamento = getParamFromQuery(
            "Isolamento_domiciliare", fromDate, toDate, "STORICO", False, False)
        result = []
        for i in range(len(positivi)):
            dateItem = {"data": positivi[i]["data"]}
            for region in positivi[i].keys():
                if region != "data" and region != "zero":
                    dateItem[region] = 100 * isolamento[i][region] / \
                        positivi[i][region] if positivi[i][region] != 0 else 0
            result.append(dateItem)
    return smoothGraph(result) if smooth else result

    tic = Tikhonov(alpha=alpha)
    tic.fit(y=y, X=X, L=L)
    return tic.predict(X)


def smooth_differentiate(y, X, L, alpha):
    tic = Tikhonov(alpha=alpha)
    tic.fit(y=y, X=X, L=L)
    return tic.coef_


def Rt(fromDate, toDate, smooth, table):
    # Naming format comes from the formula found here: https://github.com/tomorrowdata/COVID-19/blob/main/notebooks/Rt_on_italian_national_data.ipynb
    if table == "VARIAZIONE":
        result = Rt(fromDate, toDate, False, "STORICO")
        for i in range(len(result)-1, 0, -1):
            for region in result[i].keys():
                if region != "data" and region != "soglia":
                    result[i][region] = result[i][region] - result[i-1][region]
            result[i]["zero"] = 0
            del result[i]["soglia"]
        for region in result[0].keys():
            if region != "data" and region != "soglia":
                result[0][region] = 0
        del result[0]["soglia"]
        result[0]["zero"] = 0

    else:
        positivi = getParamFromQuery(
            "Nuovi_positivi", fromDate, toDate, "STORICO", False, False)
        result = []

        w = stats.gamma.pdf(np.linspace(1, len(positivi) - 1,
                                        len(positivi)), a=1.87, scale=1 / 0.28)
        for t in range(2, len(positivi)):
            thisDate = {}
            for region in positivi[t]:
                if region == "data":
                    thisDate["data"] = positivi[t][region]
                    thisDate["soglia"] = 1
                elif region != "zero":
                    sum = 0
                    for s in range(1, t):
                        sum += (positivi[t-s][region] * w[s]
                                if positivi[t-s][region] else 0)
                    val = 0 if (
                        sum == 0 or not positivi[t][region]) else positivi[t][region]/sum
                    thisDate[region] = None if np.isnan(
                        val) or np.isinf(val) else val
            result.append(thisDate)
    return smoothGraph(result) if smooth else result


def smoothGraph(data):
    newdata = []
    for date in data:
        newdata.append({"data": date["data"]})
        if "zero" in data[0].keys():
            newdata[len(newdata)-1]["zero"] = 0
        if "one" in data[0].keys():
            newdata[len(newdata)-1]["one"] = 1

    for region in data[0]:
        if region not in ["data", "zero", "one"]:
            thisRegion = []
            for date in data:
                thisRegion.append(date[region])
            thisRegion = smoothRegion(thisRegion)
            for i in range(len(data)):
                newdata[i][region] = thisRegion[i]
    return newdata


def smoothRegion(data):
    ALPHA = 0.1
    s = [data[0]]
    for i in range(1, len(data)):
        if data[i] == None:
            s.append(None)
        else:
            s.append(data[i]*ALPHA + (1-ALPHA)*s[i-1]
                     ) if s[i-1] != None else s.append(0)
        # s.append(data[i]*ALPHA + (1-ALPHA)*s[i-1])
    return s


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
            app.logger.info(f"Connected to MySQL database")
        else:
            app.logger.error(f"error while connecting to the database")
            quit()

        global reader
        reader = conn.cursor()

    except Exception as e:
        app.logger.error(f"{e}")
        quit()


reloadConn()

##
#   Create response for the GET "/api/raw" request
#


@app.route("/api/raw", methods=["GET"])
def raw():
    if not conn.is_connected():
        reloadConn()

    app.logger.info(f"Serving the raw database")
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
        app.logger.error(f"{e}")
        return "error"

##
#   Create response for the GET "/api/fieldlist request
#


@app.route("/api/fieldlist", methods=["GET"])
def fieldList():
    app.logger.info(f"Serving the list of fields")
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

        if "table" in request.args:
            table = request.args.get("table")
        else:
            return {}

        if "param" in request.args:
            param = request.args.get("param")
        else:
            return {}
            app.logger.info(f"Values requested, but no fields chosen")

        if "percentage" in request.args:
            if request.args.get("percentage") == "true":
                perc = True
            else:
                perc = False
        else:
            perc = False

        if "smooth" in request.args:
            if request.args.get("smooth") == "true":
                smooth = True
            else:
                smooth = False
        else:
            smooth = False

        app.logger.info(
            f"Serving the field '{param}' from table {table}{' as percentage' if perc else ''}{' smoothed' if smooth else ''}")
        resultObj = {}

        if param == "Rt":
            resultObj[param] = Rt(
                fromDate, toDate, smooth, table)

        else:
            if param in directReturnKeys:
                resultObj[param] = getParamFromQuery(
                    param, fromDate, toDate, table, perc, smooth)

            elif param == "Perc_tamp_pos":
                resultObj[param] = Perc_tamp_pos(
                    fromDate, toDate, table, smooth)

            elif param == "Perc_pos_dec":
                resultObj[param] = Perc_pos_dec(
                    fromDate, toDate, table, smooth)

            elif param == "Perc_pos_osp":
                resultObj[param] = Perc_pos_osp(
                    fromDate, toDate, table, smooth)

            elif param == "Perc_osp_intens":
                resultObj[param] = Perc_pos_intens(
                    fromDate, toDate, table, smooth)

            elif param == "Perc_pos_isolam":
                resultObj[param] = Perc_pos_isolam(
                    fromDate, toDate, table, smooth)

        return resultObj

    except Exception as e:
        app.logger.error(f"{e}")
        return {"error": "error"}, 500


if __name__ != "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
    app.logger.info(f"Starting server")
