from flask import Flask, render_template, redirect, url_for, request
import pandas as pd
import json
from yahoo_fin import stock_info as si
import datetime
import calendar

app = Flask(__name__)

ticker_data = []
with open("static/data/tickers.json") as file:
    ticker_data = json.loads(file.read())

tickers = []
    
tickers.extend(si.tickers_dow())
tickers.extend(si.tickers_nasdaq())
tickers.extend(si.tickers_sp500())

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/get-title', methods=["GET", "POST"])
def get_title():
    if request.method == "GET":
        return redirect(url_for("index"))
    ticker = request.args.get("ticker")
    for i in range(0, len(ticker_data)):
        if ticker_data[i]["ticker"] == ticker:
            return ticker_data[i]["title"]
    return "400"

@app.route("/get-data", methods=["GET", "POST"])
def get_data():
    # if request.method == "GET":
    #     return redirect(url_for("index"))
    ticker = request.args.get("ticker")

    isValid = validateTicker(ticker)

    if isValid:
        stock_data = si.get_data(ticker, start_date="06/17/2022", end_date="06/17/2023", index_as_date = True, interval="1wk")
        eps = si.get_analysts_info(ticker)['Earnings History']
        earnings_per_share = float(eps.loc[1, eps.loc[1].index[1]])
        dates = {}
        dates["ticker"] = ticker
        for date in stock_data.index:
            month = date.month
            day = date.day
            year = str(date.year)[-2:]
            date_str = str(month) + "/" + str(day) + "/"+ year

            close = round(stock_data.loc[date, "close"], 2)

            dates[date_str] = close

        return json.dumps(dates)
    else:
        return json.dumps({})

def validateTicker(ticker):
    return ticker.lower() in [t.lower() for t in tickers]

if __name__ == '__main__':
    app.run()
