// ==UserScript==
// @name         mintos extended
// @namespace    https://github.com/V1tOr/
// @version      0.0.1
// @description  extents P2P Mintos platform UI with investors decision making information
// @author       V1tOr
// @match        https://www.mintos.com/en/invest-en/*-market/*
// @grant        none
// @supportURL   https://github.com/V1tOr/user-script-mintos-extended/issues
// @downloadURL
// ==/UserScript==

(function ($) {
    'use strict';

    var investValue = 10;
    var filterResultsWrapper = $("#filter-results-wrapper");

    var observer = new MutationObserver(function (mutations) {

        var thead = filterResultsWrapper.find('.loan-table thead tr').first();
        $('<th> <input type="number" min="10" value="' + investValue + '" style="font-size:12px"> </th>')
            .appendTo(thead)
            .find("input")
            .on("change", (e) => {

                investValue = e.currentTarget.value;
                render();

            });


        render()

        // observer.disconnect();
    });

    observer.observe(filterResultsWrapper[0], {
        attributes: false,
        childList: true,
        characterData: false,
        subtree: false
    });

    function calc(investement, rate, days) {
        return (investement * (rate / 100) / 365) * days;
    }


    function render() {

        $(".m-loan-entry").each((index, element) => {
            element = $(element);

            var days = 0;
            var termText = element.find('.m-loan-term').text();
            var monthsAndDays = termText.match(/(\d*) m\. (\d*) d./);

            if (monthsAndDays) {
                days = parseInt(monthsAndDays[1] * 30) + parseInt(monthsAndDays[2]);
            }
            else {
                monthsAndDays = termText.match(/(\d*) d./);
                days = parseInt(monthsAndDays[1])
            }

            var rate = parseFloat(element.find('.m-loan-interest').last().text());
            var profit = calc(investValue, rate, days).toFixed(4)

            if (profit < 0.01) {
                element.closest('tr').css("background-color", "red");
            }
            else {
                element.closest('tr').css("background-color", "inherit");
            }

            var toolTip = '<i class="fas fa-info-circle tooltip-color-gray" data-tooltip="( ' + investValue + ' * ' + rate + '% / 365 * ' + days + ')" data-placement="bottom" data-placement-on-mobile="bottom" data-theme="dark" data-tooltip-trigger="hover,click"></i>'

            var profitColumn = $('<td class="global-align-right m-labeled-col mod-highlighted" data-m-label="Profit"><span title="EUR">€</span> ' + profit + toolTip + '</td>');
            profitColumn.appendTo(element);
        });

        performTooltipInitForBlock();

    }

})(jQuery);