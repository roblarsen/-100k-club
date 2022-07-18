//https://inflationdata.com/Inflation/Consumer_Price_Index/HistoricalCPI.aspx?reloaded=true

const data = [{
  "Year": 1913,
  "Jan": 9.8,
  "Feb": 9.8,
  "Mar": 9.8,
  "Apr": 9.8,
  "May": 9.7,
  "Jun": 9.8,
  "Jul": 9.9,
  "Aug": 9.9,
  "Sep": 10,
  "Oct": 10,
  "Nov": 10.1,
  "Dec": 10,
  "Annual": 9.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1914,
  "Jan": 10,
  "Feb": 9.9,
  "Mar": 9.9,
  "Apr": 9.8,
  "May": 9.9,
  "Jun": 9.9,
  "Jul": 10,
  "Aug": 10.2,
  "Sep": 10.2,
  "Oct": 10.1,
  "Nov": 10.2,
  "Dec": 10.1,
  "Annual": 10,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1915,
  "Jan": 10.1,
  "Feb": 10,
  "Mar": 9.9,
  "Apr": 10,
  "May": 10.1,
  "Jun": 10.1,
  "Jul": 10.1,
  "Aug": 10.1,
  "Sep": 10.1,
  "Oct": 10.2,
  "Nov": 10.3,
  "Dec": 10.3,
  "Annual": 10.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1916,
  "Jan": 10.4,
  "Feb": 10.4,
  "Mar": 10.5,
  "Apr": 10.6,
  "May": 10.7,
  "Jun": 10.8,
  "Jul": 10.8,
  "Aug": 10.9,
  "Sep": 11.1,
  "Oct": 11.3,
  "Nov": 11.5,
  "Dec": 11.6,
  "Annual": 10.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1917,
  "Jan": 11.7,
  "Feb": 12,
  "Mar": 12,
  "Apr": 12.6,
  "May": 12.8,
  "Jun": 13,
  "Jul": 12.8,
  "Aug": 13,
  "Sep": 13.3,
  "Oct": 13.5,
  "Nov": 13.5,
  "Dec": 13.7,
  "Annual": 12.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1918,
  "Jan": 14,
  "Feb": 14.1,
  "Mar": 14,
  "Apr": 14.2,
  "May": 14.5,
  "Jun": 14.7,
  "Jul": 15.1,
  "Aug": 15.4,
  "Sep": 15.7,
  "Oct": 16,
  "Nov": 16.3,
  "Dec": 16.5,
  "Annual": 15.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1919,
  "Jan": 16.5,
  "Feb": 16.2,
  "Mar": 16.4,
  "Apr": 16.7,
  "May": 16.9,
  "Jun": 16.9,
  "Jul": 17.4,
  "Aug": 17.7,
  "Sep": 17.8,
  "Oct": 18.1,
  "Nov": 18.5,
  "Dec": 18.9,
  "Annual": 17.3,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1920,
  "Jan": 19.3,
  "Feb": 19.5,
  "Mar": 19.7,
  "Apr": 20.3,
  "May": 20.6,
  "Jun": 20.9,
  "Jul": 20.8,
  "Aug": 20.3,
  "Sep": 20,
  "Oct": 19.9,
  "Nov": 19.8,
  "Dec": 19.4,
  "Annual": 20,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1921,
  "Jan": 19,
  "Feb": 18.4,
  "Mar": 18.3,
  "Apr": 18.1,
  "May": 17.7,
  "Jun": 17.6,
  "Jul": 17.7,
  "Aug": 17.7,
  "Sep": 17.5,
  "Oct": 17.5,
  "Nov": 17.4,
  "Dec": 17.3,
  "Annual": 17.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1922,
  "Jan": 16.9,
  "Feb": 16.9,
  "Mar": 16.7,
  "Apr": 16.7,
  "May": 16.7,
  "Jun": 16.7,
  "Jul": 16.8,
  "Aug": 16.6,
  "Sep": 16.6,
  "Oct": 16.7,
  "Nov": 16.8,
  "Dec": 16.9,
  "Annual": 16.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1923,
  "Jan": 16.8,
  "Feb": 16.8,
  "Mar": 16.8,
  "Apr": 16.9,
  "May": 16.9,
  "Jun": 17,
  "Jul": 17.2,
  "Aug": 17.1,
  "Sep": 17.2,
  "Oct": 17.3,
  "Nov": 17.3,
  "Dec": 17.3,
  "Annual": 17.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1924,
  "Jan": 17.3,
  "Feb": 17.2,
  "Mar": 17.1,
  "Apr": 17,
  "May": 17,
  "Jun": 17,
  "Jul": 17.1,
  "Aug": 17,
  "Sep": 17.1,
  "Oct": 17.2,
  "Nov": 17.2,
  "Dec": 17.3,
  "Annual": 17.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1925,
  "Jan": 17.3,
  "Feb": 17.2,
  "Mar": 17.3,
  "Apr": 17.2,
  "May": 17.3,
  "Jun": 17.5,
  "Jul": 17.7,
  "Aug": 17.7,
  "Sep": 17.7,
  "Oct": 17.7,
  "Nov": 18,
  "Dec": 17.9,
  "Annual": 17.5,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1926,
  "Jan": 17.9,
  "Feb": 17.9,
  "Mar": 17.8,
  "Apr": 17.9,
  "May": 17.8,
  "Jun": 17.7,
  "Jul": 17.5,
  "Aug": 17.4,
  "Sep": 17.5,
  "Oct": 17.6,
  "Nov": 17.7,
  "Dec": 17.7,
  "Annual": 17.7,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1927,
  "Jan": 17.5,
  "Feb": 17.4,
  "Mar": 17.3,
  "Apr": 17.3,
  "May": 17.4,
  "Jun": 17.6,
  "Jul": 17.3,
  "Aug": 17.2,
  "Sep": 17.3,
  "Oct": 17.4,
  "Nov": 17.3,
  "Dec": 17.3,
  "Annual": 17.4,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1928,
  "Jan": 17.3,
  "Feb": 17.1,
  "Mar": 17.1,
  "Apr": 17.1,
  "May": 17.2,
  "Jun": 17.1,
  "Jul": 17.1,
  "Aug": 17.1,
  "Sep": 17.3,
  "Oct": 17.2,
  "Nov": 17.2,
  "Dec": 17.1,
  "Annual": 17.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1929,
  "Jan": 17.1,
  "Feb": 17.1,
  "Mar": 17,
  "Apr": 16.9,
  "May": 17,
  "Jun": 17.1,
  "Jul": 17.3,
  "Aug": 17.3,
  "Sep": 17.3,
  "Oct": 17.3,
  "Nov": 17.3,
  "Dec": 17.2,
  "Annual": 17.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1930,
  "Jan": 17.1,
  "Feb": 17,
  "Mar": 16.9,
  "Apr": 17,
  "May": 16.9,
  "Jun": 16.8,
  "Jul": 16.6,
  "Aug": 16.5,
  "Sep": 16.6,
  "Oct": 16.5,
  "Nov": 16.4,
  "Dec": 16.1,
  "Annual": 16.7,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1931,
  "Jan": 15.9,
  "Feb": 15.7,
  "Mar": 15.6,
  "Apr": 15.5,
  "May": 15.3,
  "Jun": 15.1,
  "Jul": 15.1,
  "Aug": 15.1,
  "Sep": 15,
  "Oct": 14.9,
  "Nov": 14.7,
  "Dec": 14.6,
  "Annual": 15.2,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1932,
  "Jan": 14.3,
  "Feb": 14.1,
  "Mar": 14,
  "Apr": 13.9,
  "May": 13.7,
  "Jun": 13.6,
  "Jul": 13.6,
  "Aug": 13.5,
  "Sep": 13.4,
  "Oct": 13.3,
  "Nov": 13.2,
  "Dec": 13.1,
  "Annual": 13.7,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1933,
  "Jan": 12.9,
  "Feb": 12.7,
  "Mar": 12.6,
  "Apr": 12.6,
  "May": 12.6,
  "Jun": 12.7,
  "Jul": 13.1,
  "Aug": 13.2,
  "Sep": 13.2,
  "Oct": 13.2,
  "Nov": 13.2,
  "Dec": 13.2,
  "Annual": 13,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1934,
  "Jan": 13.2,
  "Feb": 13.3,
  "Mar": 13.3,
  "Apr": 13.3,
  "May": 13.3,
  "Jun": 13.4,
  "Jul": 13.4,
  "Aug": 13.4,
  "Sep": 13.6,
  "Oct": 13.5,
  "Nov": 13.5,
  "Dec": 13.4,
  "Annual": 13.4,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1935,
  "Jan": 13.6,
  "Feb": 13.7,
  "Mar": 13.7,
  "Apr": 13.8,
  "May": 13.8,
  "Jun": 13.7,
  "Jul": 13.7,
  "Aug": 13.7,
  "Sep": 13.7,
  "Oct": 13.7,
  "Nov": 13.8,
  "Dec": 13.8,
  "Annual": 13.7,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1936,
  "Jan": 13.8,
  "Feb": 13.8,
  "Mar": 13.7,
  "Apr": 13.7,
  "May": 13.7,
  "Jun": 13.8,
  "Jul": 13.9,
  "Aug": 14,
  "Sep": 14,
  "Oct": 14,
  "Nov": 14,
  "Dec": 14,
  "Annual": 13.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1937,
  "Jan": 14.1,
  "Feb": 14.1,
  "Mar": 14.2,
  "Apr": 14.3,
  "May": 14.4,
  "Jun": 14.4,
  "Jul": 14.5,
  "Aug": 14.5,
  "Sep": 14.6,
  "Oct": 14.6,
  "Nov": 14.5,
  "Dec": 14.4,
  "Annual": 14.4,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1938,
  "Jan": 14.2,
  "Feb": 14.1,
  "Mar": 14.1,
  "Apr": 14.2,
  "May": 14.1,
  "Jun": 14.1,
  "Jul": 14.1,
  "Aug": 14.1,
  "Sep": 14.1,
  "Oct": 14,
  "Nov": 14,
  "Dec": 14,
  "Annual": 14.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1939,
  "Jan": 14,
  "Feb": 13.9,
  "Mar": 13.9,
  "Apr": 13.8,
  "May": 13.8,
  "Jun": 13.8,
  "Jul": 13.8,
  "Aug": 13.8,
  "Sep": 14.1,
  "Oct": 14,
  "Nov": 14,
  "Dec": 14,
  "Annual": 13.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1940,
  "Jan": 13.9,
  "Feb": 14,
  "Mar": 14,
  "Apr": 14,
  "May": 14,
  "Jun": 14.1,
  "Jul": 14,
  "Aug": 14,
  "Sep": 14,
  "Oct": 14,
  "Nov": 14,
  "Dec": 14.1,
  "Annual": 14,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1941,
  "Jan": 14.1,
  "Feb": 14.1,
  "Mar": 14.2,
  "Apr": 14.3,
  "May": 14.4,
  "Jun": 14.7,
  "Jul": 14.7,
  "Aug": 14.9,
  "Sep": 15.1,
  "Oct": 15.3,
  "Nov": 15.4,
  "Dec": 15.5,
  "Annual": 14.7,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1942,
  "Jan": 15.7,
  "Feb": 15.8,
  "Mar": 16,
  "Apr": 16.1,
  "May": 16.3,
  "Jun": 16.3,
  "Jul": 16.4,
  "Aug": 16.5,
  "Sep": 16.5,
  "Oct": 16.7,
  "Nov": 16.8,
  "Dec": 16.9,
  "Annual": 16.3,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1943,
  "Jan": 16.9,
  "Feb": 16.9,
  "Mar": 17.2,
  "Apr": 17.4,
  "May": 17.5,
  "Jun": 17.5,
  "Jul": 17.4,
  "Aug": 17.3,
  "Sep": 17.4,
  "Oct": 17.4,
  "Nov": 17.4,
  "Dec": 17.4,
  "Annual": 17.3,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1944,
  "Jan": 17.4,
  "Feb": 17.4,
  "Mar": 17.4,
  "Apr": 17.5,
  "May": 17.5,
  "Jun": 17.6,
  "Jul": 17.7,
  "Aug": 17.7,
  "Sep": 17.7,
  "Oct": 17.7,
  "Nov": 17.7,
  "Dec": 17.8,
  "Annual": 17.6,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1945,
  "Jan": 17.8,
  "Feb": 17.8,
  "Mar": 17.8,
  "Apr": 17.8,
  "May": 17.9,
  "Jun": 18.1,
  "Jul": 18.1,
  "Aug": 18.1,
  "Sep": 18.1,
  "Oct": 18.1,
  "Nov": 18.1,
  "Dec": 18.2,
  "Annual": 18,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1946,
  "Jan": 18.2,
  "Feb": 18.1,
  "Mar": 18.3,
  "Apr": 18.4,
  "May": 18.5,
  "Jun": 18.7,
  "Jul": 19.8,
  "Aug": 20.2,
  "Sep": 20.4,
  "Oct": 20.8,
  "Nov": 21.3,
  "Dec": 21.5,
  "Annual": 19.5,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1947,
  "Jan": 21.5,
  "Feb": 21.5,
  "Mar": 21.9,
  "Apr": 21.9,
  "May": 21.9,
  "Jun": 22,
  "Jul": 22.2,
  "Aug": 22.5,
  "Sep": 23,
  "Oct": 23,
  "Nov": 23.1,
  "Dec": 23.4,
  "Annual": 22.3,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1948,
  "Jan": 23.7,
  "Feb": 23.5,
  "Mar": 23.4,
  "Apr": 23.8,
  "May": 23.9,
  "Jun": 24.1,
  "Jul": 24.4,
  "Aug": 24.5,
  "Sep": 24.5,
  "Oct": 24.4,
  "Nov": 24.2,
  "Dec": 24.1,
  "Annual": 24.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1949,
  "Jan": 24,
  "Feb": 23.8,
  "Mar": 23.8,
  "Apr": 23.9,
  "May": 23.8,
  "Jun": 23.9,
  "Jul": 23.7,
  "Aug": 23.8,
  "Sep": 23.9,
  "Oct": 23.7,
  "Nov": 23.8,
  "Dec": 23.6,
  "Annual": 23.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1950,
  "Jan": 23.5,
  "Feb": 23.5,
  "Mar": 23.6,
  "Apr": 23.6,
  "May": 23.7,
  "Jun": 23.8,
  "Jul": 24.1,
  "Aug": 24.3,
  "Sep": 24.4,
  "Oct": 24.6,
  "Nov": 24.7,
  "Dec": 25,
  "Annual": 24.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1951,
  "Jan": 25.4,
  "Feb": 25.7,
  "Mar": 25.8,
  "Apr": 25.8,
  "May": 25.9,
  "Jun": 25.9,
  "Jul": 25.9,
  "Aug": 25.9,
  "Sep": 26.1,
  "Oct": 26.2,
  "Nov": 26.4,
  "Dec": 26.5,
  "Annual": 26,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1952,
  "Jan": 26.5,
  "Feb": 26.3,
  "Mar": 26.3,
  "Apr": 26.4,
  "May": 26.4,
  "Jun": 26.5,
  "Jul": 26.7,
  "Aug": 26.7,
  "Sep": 26.7,
  "Oct": 26.7,
  "Nov": 26.7,
  "Dec": 26.7,
  "Annual": 26.5,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1953,
  "Jan": 26.6,
  "Feb": 26.5,
  "Mar": 26.6,
  "Apr": 26.6,
  "May": 26.7,
  "Jun": 26.8,
  "Jul": 26.8,
  "Aug": 26.9,
  "Sep": 26.9,
  "Oct": 27,
  "Nov": 26.9,
  "Dec": 26.9,
  "Annual": 26.7,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1954,
  "Jan": 26.9,
  "Feb": 26.9,
  "Mar": 26.9,
  "Apr": 26.8,
  "May": 26.9,
  "Jun": 26.9,
  "Jul": 26.9,
  "Aug": 26.9,
  "Sep": 26.8,
  "Oct": 26.8,
  "Nov": 26.8,
  "Dec": 26.7,
  "Annual": 26.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1955,
  "Jan": 26.7,
  "Feb": 26.7,
  "Mar": 26.7,
  "Apr": 26.7,
  "May": 26.7,
  "Jun": 26.7,
  "Jul": 26.8,
  "Aug": 26.8,
  "Sep": 26.9,
  "Oct": 26.9,
  "Nov": 26.9,
  "Dec": 26.8,
  "Annual": 26.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1956,
  "Jan": 26.8,
  "Feb": 26.8,
  "Mar": 26.8,
  "Apr": 26.9,
  "May": 27,
  "Jun": 27.2,
  "Jul": 27.4,
  "Aug": 27.3,
  "Sep": 27.4,
  "Oct": 27.5,
  "Nov": 27.5,
  "Dec": 27.6,
  "Annual": 27.2,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1957,
  "Jan": 27.6,
  "Feb": 27.7,
  "Mar": 27.8,
  "Apr": 27.9,
  "May": 28,
  "Jun": 28.1,
  "Jul": 28.3,
  "Aug": 28.3,
  "Sep": 28.3,
  "Oct": 28.3,
  "Nov": 28.4,
  "Dec": 28.4,
  "Annual": 28.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1958,
  "Jan": 28.6,
  "Feb": 28.6,
  "Mar": 28.8,
  "Apr": 28.9,
  "May": 28.9,
  "Jun": 28.9,
  "Jul": 29,
  "Aug": 28.9,
  "Sep": 28.9,
  "Oct": 28.9,
  "Nov": 29,
  "Dec": 28.9,
  "Annual": 28.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1959,
  "Jan": 29,
  "Feb": 28.9,
  "Mar": 28.9,
  "Apr": 29,
  "May": 29,
  "Jun": 29.1,
  "Jul": 29.2,
  "Aug": 29.2,
  "Sep": 29.3,
  "Oct": 29.4,
  "Nov": 29.4,
  "Dec": 29.4,
  "Annual": 29.1,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1960,
  "Jan": 29.3,
  "Feb": 29.4,
  "Mar": 29.4,
  "Apr": 29.5,
  "May": 29.5,
  "Jun": 29.6,
  "Jul": 29.6,
  "Aug": 29.6,
  "Sep": 29.6,
  "Oct": 29.8,
  "Nov": 29.8,
  "Dec": 29.8,
  "Annual": 29.6,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1961,
  "Jan": 29.8,
  "Feb": 29.8,
  "Mar": 29.8,
  "Apr": 29.8,
  "May": 29.8,
  "Jun": 29.8,
  "Jul": 30,
  "Aug": 29.9,
  "Sep": 30,
  "Oct": 30,
  "Nov": 30,
  "Dec": 30,
  "Annual": 29.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1962,
  "Jan": 30,
  "Feb": 30.1,
  "Mar": 30.1,
  "Apr": 30.2,
  "May": 30.2,
  "Jun": 30.2,
  "Jul": 30.3,
  "Aug": 30.3,
  "Sep": 30.4,
  "Oct": 30.4,
  "Nov": 30.4,
  "Dec": 30.4,
  "Annual": 30.2,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1963,
  "Jan": 30.4,
  "Feb": 30.4,
  "Mar": 30.5,
  "Apr": 30.5,
  "May": 30.5,
  "Jun": 30.6,
  "Jul": 30.7,
  "Aug": 30.7,
  "Sep": 30.7,
  "Oct": 30.8,
  "Nov": 30.8,
  "Dec": 30.9,
  "Annual": 30.6,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1964,
  "Jan": 30.9,
  "Feb": 30.9,
  "Mar": 30.9,
  "Apr": 30.9,
  "May": 30.9,
  "Jun": 31,
  "Jul": 31.1,
  "Aug": 31,
  "Sep": 31.1,
  "Oct": 31.1,
  "Nov": 31.2,
  "Dec": 31.2,
  "Annual": 31,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1965,
  "Jan": 31.2,
  "Feb": 31.2,
  "Mar": 31.3,
  "Apr": 31.4,
  "May": 31.4,
  "Jun": 31.6,
  "Jul": 31.6,
  "Aug": 31.6,
  "Sep": 31.6,
  "Oct": 31.7,
  "Nov": 31.7,
  "Dec": 31.8,
  "Annual": 31.5,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1966,
  "Jan": 31.8,
  "Feb": 32,
  "Mar": 32.1,
  "Apr": 32.3,
  "May": 32.3,
  "Jun": 32.4,
  "Jul": 32.5,
  "Aug": 32.7,
  "Sep": 32.7,
  "Oct": 32.9,
  "Nov": 32.9,
  "Dec": 32.9,
  "Annual": 32.4,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1967,
  "Jan": 32.9,
  "Feb": 32.9,
  "Mar": 33,
  "Apr": 33.1,
  "May": 33.2,
  "Jun": 33.3,
  "Jul": 33.4,
  "Aug": 33.5,
  "Sep": 33.6,
  "Oct": 33.7,
  "Nov": 33.8,
  "Dec": 33.9,
  "Annual": 33.4,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1968,
  "Jan": 34.1,
  "Feb": 34.2,
  "Mar": 34.3,
  "Apr": 34.4,
  "May": 34.5,
  "Jun": 34.7,
  "Jul": 34.9,
  "Aug": 35,
  "Sep": 35.1,
  "Oct": 35.3,
  "Nov": 35.4,
  "Dec": 35.5,
  "Annual": 34.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1969,
  "Jan": 35.6,
  "Feb": 35.8,
  "Mar": 36.1,
  "Apr": 36.3,
  "May": 36.4,
  "Jun": 36.6,
  "Jul": 36.8,
  "Aug": 37,
  "Sep": 37.1,
  "Oct": 37.3,
  "Nov": 37.5,
  "Dec": 37.7,
  "Annual": 36.7,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1970,
  "Jan": 37.8,
  "Feb": 38,
  "Mar": 38.2,
  "Apr": 38.5,
  "May": 38.6,
  "Jun": 38.8,
  "Jul": 39,
  "Aug": 39,
  "Sep": 39.2,
  "Oct": 39.4,
  "Nov": 39.6,
  "Dec": 39.8,
  "Annual": 38.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1971,
  "Jan": 39.8,
  "Feb": 39.9,
  "Mar": 40,
  "Apr": 40.1,
  "May": 40.3,
  "Jun": 40.6,
  "Jul": 40.7,
  "Aug": 40.8,
  "Sep": 40.8,
  "Oct": 40.9,
  "Nov": 40.9,
  "Dec": 41.1,
  "Annual": 40.5,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1972,
  "Jan": 41.1,
  "Feb": 41.3,
  "Mar": 41.4,
  "Apr": 41.5,
  "May": 41.6,
  "Jun": 41.7,
  "Jul": 41.9,
  "Aug": 42,
  "Sep": 42.1,
  "Oct": 42.3,
  "Nov": 42.4,
  "Dec": 42.5,
  "Annual": 41.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1973,
  "Jan": 42.6,
  "Feb": 42.9,
  "Mar": 43.3,
  "Apr": 43.6,
  "May": 43.9,
  "Jun": 44.2,
  "Jul": 44.3,
  "Aug": 45.1,
  "Sep": 45.2,
  "Oct": 45.6,
  "Nov": 45.9,
  "Dec": 46.2,
  "Annual": 44.4,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1974,
  "Jan": 46.6,
  "Feb": 47.2,
  "Mar": 47.8,
  "Apr": 48,
  "May": 48.6,
  "Jun": 49,
  "Jul": 49.4,
  "Aug": 50,
  "Sep": 50.6,
  "Oct": 51.1,
  "Nov": 51.5,
  "Dec": 51.9,
  "Annual": 49.3,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1975,
  "Jan": 52.1,
  "Feb": 52.5,
  "Mar": 52.7,
  "Apr": 52.9,
  "May": 53.2,
  "Jun": 53.6,
  "Jul": 54.2,
  "Aug": 54.3,
  "Sep": 54.6,
  "Oct": 54.9,
  "Nov": 55.3,
  "Dec": 55.5,
  "Annual": 53.8,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1976,
  "Jan": 55.6,
  "Feb": 55.8,
  "Mar": 55.9,
  "Apr": 56.1,
  "May": 56.5,
  "Jun": 56.8,
  "Jul": 57.1,
  "Aug": 57.4,
  "Sep": 57.6,
  "Oct": 57.9,
  "Nov": 58,
  "Dec": 58.2,
  "Annual": 56.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1977,
  "Jan": 58.5,
  "Feb": 59.1,
  "Mar": 59.5,
  "Apr": 60,
  "May": 60.3,
  "Jun": 60.7,
  "Jul": 61,
  "Aug": 61.2,
  "Sep": 61.4,
  "Oct": 61.6,
  "Nov": 61.9,
  "Dec": 62.1,
  "Annual": 60.6,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1978,
  "Jan": 62.5,
  "Feb": 62.9,
  "Mar": 63.4,
  "Apr": 63.9,
  "May": 64.5,
  "Jun": 65.2,
  "Jul": 65.7,
  "Aug": 66,
  "Sep": 66.5,
  "Oct": 67.1,
  "Nov": 67.4,
  "Dec": 67.7,
  "Annual": 65.2,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1979,
  "Jan": 68.3,
  "Feb": 69.1,
  "Mar": 69.8,
  "Apr": 70.6,
  "May": 71.5,
  "Jun": 72.3,
  "Jul": 73.1,
  "Aug": 73.8,
  "Sep": 74.6,
  "Oct": 75.2,
  "Nov": 75.9,
  "Dec": 76.7,
  "Annual": 72.6,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1980,
  "Jan": 77.8,
  "Feb": 78.9,
  "Mar": 80.1,
  "Apr": 81,
  "May": 81.8,
  "Jun": 82.7,
  "Jul": 82.7,
  "Aug": 83.3,
  "Sep": 84,
  "Oct": 84.8,
  "Nov": 85.5,
  "Dec": 86.3,
  "Annual": 82.4,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1981,
  "Jan": 87,
  "Feb": 87.9,
  "Mar": 88.5,
  "Apr": 89.1,
  "May": 89.8,
  "Jun": 90.6,
  "Jul": 91.6,
  "Aug": 92.3,
  "Sep": 93.2,
  "Oct": 93.4,
  "Nov": 93.7,
  "Dec": 94,
  "Annual": 90.9,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1982,
  "Jan": 94.3,
  "Feb": 94.6,
  "Mar": 94.5,
  "Apr": 94.9,
  "May": 95.8,
  "Jun": 97,
  "Jul": 97.5,
  "Aug": 97.7,
  "Sep": 97.9,
  "Oct": 98.2,
  "Nov": 98,
  "Dec": 97.6,
  "Annual": 96.5,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1983,
  "Jan": 97.8,
  "Feb": 97.9,
  "Mar": 97.9,
  "Apr": 98.6,
  "May": 99.2,
  "Jun": 99.5,
  "Jul": 99.9,
  "Aug": 100.2,
  "Sep": 100.7,
  "Oct": 101,
  "Nov": 101.2,
  "Dec": 101.3,
  "Annual": 99.6,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 1984,
  "Jan": 101.9,
  "Feb": 102.4,
  "Mar": 102.6,
  "Apr": 103.1,
  "May": 103.4,
  "Jun": 103.7,
  "Jul": 104.1,
  "Aug": 104.5,
  "Sep": 105,
  "Oct": 105.3,
  "Nov": 105.3,
  "Dec": 105.3,
  "Annual": 103.9,
  "HALF1": 102.9,
  "HALF2": 104.9
},
{
  "Year": 1985,
  "Jan": 105.5,
  "Feb": 106,
  "Mar": 106.4,
  "Apr": 106.9,
  "May": 107.3,
  "Jun": 107.6,
  "Jul": 107.8,
  "Aug": 108,
  "Sep": 108.3,
  "Oct": 108.7,
  "Nov": 109,
  "Dec": 109.3,
  "Annual": 107.6,
  "HALF1": 106.6,
  "HALF2": 108.5
},
{
  "Year": 1986,
  "Jan": 109.6,
  "Feb": 109.3,
  "Mar": 108.8,
  "Apr": 108.6,
  "May": 108.9,
  "Jun": 109.5,
  "Jul": 109.5,
  "Aug": 109.7,
  "Sep": 110.2,
  "Oct": 110.3,
  "Nov": 110.4,
  "Dec": 110.5,
  "Annual": 109.6,
  "HALF1": 109.1,
  "HALF2": 110.1
},
{
  "Year": 1987,
  "Jan": 111.2,
  "Feb": 111.6,
  "Mar": 112.1,
  "Apr": 112.7,
  "May": 113.1,
  "Jun": 113.5,
  "Jul": 113.8,
  "Aug": 114.4,
  "Sep": 115,
  "Oct": 115.3,
  "Nov": 115.4,
  "Dec": 115.4,
  "Annual": 113.6,
  "HALF1": 112.4,
  "HALF2": 114.9
},
{
  "Year": 1988,
  "Jan": 115.7,
  "Feb": 116,
  "Mar": 116.5,
  "Apr": 117.1,
  "May": 117.5,
  "Jun": 118,
  "Jul": 118.5,
  "Aug": 119,
  "Sep": 119.8,
  "Oct": 120.2,
  "Nov": 120.3,
  "Dec": 120.5,
  "Annual": 118.3,
  "HALF1": 116.8,
  "HALF2": 119.7
},
{
  "Year": 1989,
  "Jan": 121.1,
  "Feb": 121.6,
  "Mar": 122.3,
  "Apr": 123.1,
  "May": 123.8,
  "Jun": 124.1,
  "Jul": 124.4,
  "Aug": 124.6,
  "Sep": 125,
  "Oct": 125.6,
  "Nov": 125.9,
  "Dec": 126.1,
  "Annual": 124,
  "HALF1": 122.7,
  "HALF2": 125.3
},
{
  "Year": 1990,
  "Jan": 127.4,
  "Feb": 128,
  "Mar": 128.7,
  "Apr": 128.9,
  "May": 129.2,
  "Jun": 129.9,
  "Jul": 130.4,
  "Aug": 131.6,
  "Sep": 132.7,
  "Oct": 133.5,
  "Nov": 133.8,
  "Dec": 133.8,
  "Annual": 130.7,
  "HALF1": 128.7,
  "HALF2": 132.6
},
{
  "Year": 1991,
  "Jan": 134.6,
  "Feb": 134.8,
  "Mar": 135,
  "Apr": 135.2,
  "May": 135.6,
  "Jun": 136,
  "Jul": 136.2,
  "Aug": 136.6,
  "Sep": 137.2,
  "Oct": 137.4,
  "Nov": 137.8,
  "Dec": 137.9,
  "Annual": 136.2,
  "HALF1": 135.2,
  "HALF2": 137.2
},
{
  "Year": 1992,
  "Jan": 138.1,
  "Feb": 138.6,
  "Mar": 139.3,
  "Apr": 139.5,
  "May": 139.7,
  "Jun": 140.2,
  "Jul": 140.5,
  "Aug": 140.9,
  "Sep": 141.3,
  "Oct": 141.8,
  "Nov": 142,
  "Dec": 141.9,
  "Annual": 140.3,
  "HALF1": 139.2,
  "HALF2": 141.4
},
{
  "Year": 1993,
  "Jan": 142.6,
  "Feb": 143.1,
  "Mar": 143.6,
  "Apr": 144,
  "May": 144.2,
  "Jun": 144.4,
  "Jul": 144.4,
  "Aug": 144.8,
  "Sep": 145.1,
  "Oct": 145.7,
  "Nov": 145.8,
  "Dec": 145.8,
  "Annual": 144.5,
  "HALF1": 143.7,
  "HALF2": 145.3
},
{
  "Year": 1994,
  "Jan": 146.2,
  "Feb": 146.7,
  "Mar": 147.2,
  "Apr": 147.4,
  "May": 147.5,
  "Jun": 148,
  "Jul": 148.4,
  "Aug": 149,
  "Sep": 149.4,
  "Oct": 149.5,
  "Nov": 149.7,
  "Dec": 149.7,
  "Annual": 148.2,
  "HALF1": 147.2,
  "HALF2": 149.3
},
{
  "Year": 1995,
  "Jan": 150.3,
  "Feb": 150.9,
  "Mar": 151.4,
  "Apr": 151.9,
  "May": 152.2,
  "Jun": 152.5,
  "Jul": 152.5,
  "Aug": 152.9,
  "Sep": 153.2,
  "Oct": 153.7,
  "Nov": 153.6,
  "Dec": 153.5,
  "Annual": 152.4,
  "HALF1": 151.5,
  "HALF2": 153.2
},
{
  "Year": 1996,
  "Jan": 154.4,
  "Feb": 154.9,
  "Mar": 155.7,
  "Apr": 156.3,
  "May": 156.6,
  "Jun": 156.7,
  "Jul": 157,
  "Aug": 157.3,
  "Sep": 157.8,
  "Oct": 158.3,
  "Nov": 158.6,
  "Dec": 158.6,
  "Annual": 156.9,
  "HALF1": 155.8,
  "HALF2": 157.9
},
{
  "Year": 1997,
  "Jan": 159.1,
  "Feb": 159.6,
  "Mar": 160,
  "Apr": 160.2,
  "May": 160.1,
  "Jun": 160.3,
  "Jul": 160.5,
  "Aug": 160.8,
  "Sep": 161.2,
  "Oct": 161.6,
  "Nov": 161.5,
  "Dec": 161.3,
  "Annual": 160.5,
  "HALF1": 159.9,
  "HALF2": 161.2
},
{
  "Year": 1998,
  "Jan": 161.6,
  "Feb": 161.9,
  "Mar": 162.2,
  "Apr": 162.5,
  "May": 162.8,
  "Jun": 163,
  "Jul": 163.2,
  "Aug": 163.4,
  "Sep": 163.6,
  "Oct": 164,
  "Nov": 164,
  "Dec": 163.9,
  "Annual": 163,
  "HALF1": 162.3,
  "HALF2": 163.7
},
{
  "Year": 1999,
  "Jan": 164.3,
  "Feb": 164.5,
  "Mar": 165,
  "Apr": 166.2,
  "May": 166.2,
  "Jun": 166.2,
  "Jul": 166.7,
  "Aug": 167.1,
  "Sep": 167.9,
  "Oct": 168.2,
  "Nov": 168.3,
  "Dec": 168.3,
  "Annual": 166.6,
  "HALF1": 165.4,
  "HALF2": 167.8
},
{
  "Year": 2000,
  "Jan": 168.8,
  "Feb": 169.8,
  "Mar": 171.2,
  "Apr": 171.3,
  "May": 171.5,
  "Jun": 172.4,
  "Jul": 172.8,
  "Aug": 172.8,
  "Sep": 173.7,
  "Oct": 174,
  "Nov": 174.1,
  "Dec": 174,
  "Annual": 172.2,
  "HALF1": 170.8,
  "HALF2": 173.6
},
{
  "Year": 2001,
  "Jan": 175.1,
  "Feb": 175.8,
  "Mar": 176.2,
  "Apr": 176.9,
  "May": 177.7,
  "Jun": 178,
  "Jul": 177.5,
  "Aug": 177.5,
  "Sep": 178.3,
  "Oct": 177.7,
  "Nov": 177.4,
  "Dec": 176.7,
  "Annual": 177.1,
  "HALF1": 176.6,
  "HALF2": 177.5
},
{
  "Year": 2002,
  "Jan": 177.1,
  "Feb": 177.8,
  "Mar": 178.8,
  "Apr": 179.8,
  "May": 179.8,
  "Jun": 179.9,
  "Jul": 180.1,
  "Aug": 180.7,
  "Sep": 181,
  "Oct": 181.3,
  "Nov": 181.3,
  "Dec": 180.9,
  "Annual": 179.9,
  "HALF1": 178.9,
  "HALF2": 180.9
},
{
  "Year": 2003,
  "Jan": 181.7,
  "Feb": 183.1,
  "Mar": 184.2,
  "Apr": 183.8,
  "May": 183.5,
  "Jun": 183.7,
  "Jul": 183.9,
  "Aug": 184.6,
  "Sep": 185.2,
  "Oct": 185,
  "Nov": 184.5,
  "Dec": 184.3,
  "Annual": 184,
  "HALF1": 183.3,
  "HALF2": 184.6
},
{
  "Year": 2004,
  "Jan": 185.2,
  "Feb": 186.2,
  "Mar": 187.4,
  "Apr": 188,
  "May": 189.1,
  "Jun": 189.7,
  "Jul": 189.4,
  "Aug": 189.5,
  "Sep": 189.9,
  "Oct": 190.9,
  "Nov": 191,
  "Dec": 190.3,
  "Annual": 188.9,
  "HALF1": 187.6,
  "HALF2": 190.2
},
{
  "Year": 2005,
  "Jan": 190.7,
  "Feb": 191.8,
  "Mar": 193.3,
  "Apr": 194.6,
  "May": 194.4,
  "Jun": 194.5,
  "Jul": 195.4,
  "Aug": 196.4,
  "Sep": 198.8,
  "Oct": 199.2,
  "Nov": 197.6,
  "Dec": 196.8,
  "Annual": 195.3,
  "HALF1": 193.2,
  "HALF2": 197.4
},
{
  "Year": 2006,
  "Jan": 198.3,
  "Feb": 198.7,
  "Mar": 199.8,
  "Apr": 201.5,
  "May": 202.5,
  "Jun": 202.9,
  "Jul": 203.5,
  "Aug": 203.9,
  "Sep": 202.9,
  "Oct": 201.8,
  "Nov": 201.5,
  "Dec": 201.8,
  "Annual": 201.6,
  "HALF1": 200.6,
  "HALF2": 202.6
},
{
  "Year": 2007,
  "Jan": 202.416,
  "Feb": 203.499,
  "Mar": 205.352,
  "Apr": 206.686,
  "May": 207.949,
  "Jun": 208.352,
  "Jul": 208.299,
  "Aug": 207.917,
  "Sep": 208.49,
  "Oct": 208.936,
  "Nov": 210.177,
  "Dec": 210.036,
  "Annual": 207.342,
  "HALF1": 205.709,
  "HALF2": 208.976
},
{
  "Year": 2008,
  "Jan": 211.08,
  "Feb": 211.693,
  "Mar": 213.528,
  "Apr": 214.823,
  "May": 216.632,
  "Jun": 218.815,
  "Jul": 219.964,
  "Aug": 219.086,
  "Sep": 218.783,
  "Oct": 216.573,
  "Nov": 212.425,
  "Dec": 210.228,
  "Annual": 215.303,
  "HALF1": 214.429,
  "HALF2": 216.177
},
{
  "Year": 2009,
  "Jan": 211.143,
  "Feb": 212.193,
  "Mar": 212.709,
  "Apr": 213.24,
  "May": 213.856,
  "Jun": 215.693,
  "Jul": 215.351,
  "Aug": 215.834,
  "Sep": 215.969,
  "Oct": 216.177,
  "Nov": 216.33,
  "Dec": 215.949,
  "Annual": 214.537,
  "HALF1": 213.139,
  "HALF2": 215.935
},
{
  "Year": 2010,
  "Jan": 216.687,
  "Feb": 216.741,
  "Mar": 217.631,
  "Apr": 218.009,
  "May": 218.178,
  "Jun": 217.965,
  "Jul": 218.011,
  "Aug": 218.312,
  "Sep": 218.439,
  "Oct": 218.711,
  "Nov": 218.803,
  "Dec": 219.179,
  "Annual": 218.056,
  "HALF1": 217.535,
  "HALF2": 218.576
},
{
  "Year": 2011,
  "Jan": 220.223,
  "Feb": 221.309,
  "Mar": 223.467,
  "Apr": 224.906,
  "May": 225.964,
  "Jun": 225.722,
  "Jul": 225.922,
  "Aug": 226.545,
  "Sep": 226.889,
  "Oct": 226.421,
  "Nov": 226.23,
  "Dec": 225.672,
  "Annual": 224.939,
  "HALF1": 223.598,
  "HALF2": 226.28
},
{
  "Year": 2012,
  "Jan": 226.665,
  "Feb": 227.663,
  "Mar": 229.392,
  "Apr": 230.085,
  "May": 229.815,
  "Jun": 229.478,
  "Jul": 229.104,
  "Aug": 230.379,
  "Sep": 231.407,
  "Oct": 231.317,
  "Nov": 230.221,
  "Dec": 229.601,
  "Annual": 229.594,
  "HALF1": 228.85,
  "HALF2": 230.338
},
{
  "Year": 2013,
  "Jan": 230.28,
  "Feb": 232.166,
  "Mar": 232.773,
  "Apr": 232.531,
  "May": 232.945,
  "Jun": 233.504,
  "Jul": 233.596,
  "Aug": 233.877,
  "Sep": 234.149,
  "Oct": 233.546,
  "Nov": 233.069,
  "Dec": 233.049,
  "Annual": 232.957,
  "HALF1": 232.366,
  "HALF2": 233.548
},
{
  "Year": 2014,
  "Jan": 233.916,
  "Feb": 234.781,
  "Mar": 236.293,
  "Apr": 237.072,
  "May": 237.9,
  "Jun": 238.343,
  "Jul": 238.25,
  "Aug": 237.852,
  "Sep": 238.031,
  "Oct": 237.433,
  "Nov": 236.151,
  "Dec": 234.812,
  "Annual": 236.736,
  "HALF1": 236.384,
  "HALF2": 237.088
},
{
  "Year": 2015,
  "Jan": 233.707,
  "Feb": 234.722,
  "Mar": 236.119,
  "Apr": 236.599,
  "May": 237.805,
  "Jun": 238.638,
  "Jul": 238.654,
  "Aug": 238.316,
  "Sep": 237.945,
  "Oct": 237.838,
  "Nov": 237.336,
  "Dec": 236.525,
  "Annual": 237.017,
  "HALF1": 236.265,
  "HALF2": 237.769
},
{
  "Year": 2016,
  "Jan": 236.916,
  "Feb": 237.111,
  "Mar": 238.132,
  "Apr": 239.261,
  "May": 240.229,
  "Jun": 241.018,
  "Jul": 240.628,
  "Aug": 240.849,
  "Sep": 241.428,
  "Oct": 241.729,
  "Nov": 241.353,
  "Dec": 241.432,
  "Annual": 240.007,
  "HALF1": 238.778,
  "HALF2": 241.237
},
{
  "Year": 2017,
  "Jan": 242.839,
  "Feb": 243.603,
  "Mar": 243.801,
  "Apr": 244.524,
  "May": 244.733,
  "Jun": 244.955,
  "Jul": 244.786,
  "Aug": 245.519,
  "Sep": 246.819,
  "Oct": 246.663,
  "Nov": 246.669,
  "Dec": 246.524,
  "Annual": 245.12,
  "HALF1": 244.076,
  "HALF2": 246.163
},
{
  "Year": 2018,
  "Jan": 247.867,
  "Feb": 248.991,
  "Mar": 249.554,
  "Apr": 250.546,
  "May": 251.588,


  "Jun": 251.989,
  "Jul": 252.006,
  "Aug": 252.146,
  "Sep": 252.439,
  "Oct": 252.885,
  "Nov": 252.038,
  "Dec": 251.233,
  "Annual": 251.107,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 2019,
  "Jan": 251.712,
  "Feb": 252.776,
  "Mar": 254.202,
  "Apr": 255.548,
  "May": 256.092,


  "Jun": 256.143,
  "Jul": 256.571,
  "Aug": 256.558,
  "Sep": 256.759,
  "Oct": 257.346,
  "Nov": 257.208,
  "Dec": 256.974,
  "Annual": 255.657,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 2020,
  "Jan": 257.971,
  "Feb": 258.678,
  "Mar": 258.115,
  "Apr": 256.389,
  "May": 256.394,


  "Jun": 257.797,
  "Jul": 259.101,
  "Aug": 259.918,
  "Sep": 260.280,
  "Oct": 260.388
  ,
  "Nov": 260.229,
  "Dec": 260.474,
  "Annual": 258.811,
  "HALF1": "",
  "HALF2": ""
},
{
  "Year": 2021,
  "Jan": 261.582,
  "Feb": 263.014,
  "Mar": 264.877,
  "Apr": 267.054,
  "May": 269.195,

        
  "Jun": 271.696,
  "Jul": 273.003,
  "Aug": 273.567,
  "Sep": 274.310,
  "Oct": 276.589,
  "Nov": 277.948,
  "Dec": 277.948,
  "Annual": 277.948,
  "HALF1": "",
  "HALF2": ""
}

];
const lastFullYear = 2020
const months = [
  { abbr: "Jan", name: "January", order: 1 },
  { abbr: "Feb", name: "February", order: 2 },
  { abbr: "Mar", name: "March", order: 3 },
  { abbr: "Apr", name: "April", order: 4 },
  { abbr: "May", name: "May", order: 5 },
  { abbr: "Jun", name: "June", order: 6 },
  { abbr: "Jul", name: "July", order: 7 },
  { abbr: "Aug", name: "August", order: 8 },
  { abbr: "Sep", name: "September", order: 9 },
  { abbr: "Oct", name: "October", order: 10 },
  { abbr: "Nov", name: "November", order: 11 },
  { abbr: "Dec", name: "December", order: 12 }
]

function getCpi(year, initialMonth) {
  const month = initialMonth
    ? months.find(m => m.order === initialMonth).abbr
    : "Annual"
  const yearData = data.find(d => d.Year === year)
  return yearData[month]
}

function inflation(initialFrom, initialTo) {
  const from = initialFrom || {}
  const to = initialTo || { year: lastFullYear }
  if (!from.year) {
    throw new Error("from.year must be provided")
  } else if (!from.amount) {
    throw new Error("from.amount must be provided")
  } else if (typeof from.year !== "number") {
    throw new Error("from.year must be a number, like 1922")
  } else if (from.year < 1913) {
    throw new Error("from.year must be 1913 or later")
  }
  if (from.year > lastFullYear) {
    return (from.amount)
  }
  const fromCpi = getCpi(from.year, from.month)
  const toCpi = getCpi(to.year, to.month)

  const inflationFactor = (toCpi - fromCpi) / fromCpi
  const inflationValue = inflationFactor * from.amount
  const currentValue = inflationValue + from.amount
  return +currentValue.toFixed(2)
}