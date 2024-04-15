# README.md for Currency Converter App
This repository contains a React Native application designed to convert currencies. The main component, Converter, interacts with the exchangeratesapi.io API to fetch current currency rates and perform conversions between specified currencies. Users can enter an amount, choose from a list of currencies for both the source and the target, and view the converted result.

Features:
* Currency Conversion: Convert amounts between a variety of global currencies.
* Database Integration: Uses SQLite to save conversion history.
* Previous Conversions: View and delete past conversions stored in the database.
* Dynamic Currency Data: Fetches the latest currency exchange rates from the API.
* User Interface: Includes dropdowns for selecting currencies and buttons for performing conversions and swapping the selected currencies.

Components:
* Converter: Handles currency conversion logic.
* PreviousConversions: Displays and manages previously saved conversions.
* App: Navigation setup using React Navigation's bottom tabs.
