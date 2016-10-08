/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const YahooQuotesServiceProvider = function(anEventAggregator) {
    "use strict";
    const eventAggregator = anEventAggregator;
    let convertToCurrency;
    let quoteQueriesFromTo = [];
    let quoteQueriesToFrom = [];
    let quotesFromTo = [];
    let quotesToFrom = [];
    const gramsPerOunce = 31.1034768;
    // Since Yahoo quote response only has four decimals, we sometimes get imprecise quotes
    // In such cases, we use the inverse quote and invert it.
    const makeOneResponse = function() {
        // console.log("quotesFromTo " + quotesFromTo.length);
        quotesFromTo.forEach( function(anElement, anIndex) {
            // "USDEUR=X",0.7317
            // console.log("anElement " + anElement.symbol + anElement.rate);
            let convertFromCurrency = anElement.symbol.substr(0, 3);
            let quote = anElement.rate;
            if (quote < 0.01) {
                // "EURJPY=X",142.3186
                convertFromCurrency = quotesToFrom[anIndex].symbol.substr(3, 3);
                const reverseQuote = quotesToFrom[anIndex].rate;
                quote = reverseQuote > 0 ? 1 / reverseQuote : 0;
            }
            if (convertToCurrency == "gAu") {
                quote = quote * gramsPerOunce;
            }
            if (convertFromCurrency.length > 0) {
                // console.log(convertFromCurrency + quote);
                eventAggregator.publish("quoteReceived", {
                    convertFromCurrencyName: convertFromCurrency,
                    quote: quote
                });
            }
        });
    };
    const quotesHandlerFromTo = function(aResponse) {
        try {
            const response = JSON.parse(aResponse);
            quotesFromTo = response.query.results.row;
            if (quotesFromTo.length > 0 && quotesToFrom.length > 0) {
                makeOneResponse();
            }
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const quotesHandlerToFrom = function(aResponse) {
        try {
            const response = JSON.parse(aResponse);
            quotesToFrom = response.query.results.row;
            if (quotesFromTo.length > 0 && quotesToFrom.length > 0) {
                makeOneResponse();
            }
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const makeQuoteQuery = function(aConvertFromCurrency) {
        if (convertToCurrency === "gAu") {
            quoteQueriesFromTo.push(aConvertFromCurrency + "XAU" + "=X");
            quoteQueriesToFrom.push("XAU" + aConvertFromCurrency + "=X");
        }
        else {
            quoteQueriesFromTo.push(aConvertFromCurrency.isoName + convertToCurrency + "=X");
            quoteQueriesToFrom.push(convertToCurrency + aConvertFromCurrency.isoName + "=X");
        }
    };
    const loadQuotes = function (aYahooQuotesService, aConvertFroms, aConvertToCurrency) {
        // console.log(aConvertFromCurrencies,  aConvertToCurrency);
        convertToCurrency = aConvertToCurrency;
        quotesFromTo = [];
        quotesToFrom = [];
        quoteQueriesFromTo = [];
        quoteQueriesToFrom = [];
        aConvertFroms.forEach(makeQuoteQuery);
        const innerUrlStringFromTo = "http://download.finance.yahoo.com/d/quotes?s=" + quoteQueriesFromTo.join(",") + "&f=snl1d1t1ab";
        const innerUrlStringToFrom = "http://download.finance.yahoo.com/d/quotes?s=" + quoteQueriesToFrom.join(",") + "&f=snl1d1t1ab";
        const yqlFromTo = "select symbol, rate from csv where url='" + innerUrlStringFromTo + "' and columns='symbol,Name,rate,Date,Time,Ask,Bid'";
        const yqlToFrom = "select symbol, rate from csv where url='" + innerUrlStringToFrom + "' and columns='symbol,Name,rate,Date,Time,Ask,Bid'";
        const urlStringFromTo = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yqlFromTo) + "&format=json";
        const urlStringToFrom = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yqlToFrom) + "&format=json";
        // console.log(urlStringToFrom);
        aYahooQuotesService.fetchQuotesFromTo(urlStringFromTo);
        aYahooQuotesService.fetchQuotesToFrom(urlStringToFrom);
    };
    return {
        loadQuotes: loadQuotes,
        quotesHandlerFromTo: quotesHandlerFromTo,
        quotesHandlerToFrom: quotesHandlerToFrom
    };
};

if (typeof exports === "object") {
    exports.YahooQuotesServiceProvider = YahooQuotesServiceProvider;
}


