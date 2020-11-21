import datetime


# Get the instantaneous date and time in the format "YYYY-MM-DD HH:MM:SS"
def get_date():
    now = datetime.datetime.today()

    second = f"{now.second:02}"
    minute = f"{now.minute:02}"
    hour = f"{now.hour:02}"
    day = f"{now.day:02}"
    month = f"{now.month:02}"
    year = f"{now.year:02}"

    date = f"{year}-{month}-{day} {hour}:{minute}:{second}"

    return date
