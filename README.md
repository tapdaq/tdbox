# tdbox - Integrate Tapdaq to Buildbox

tdbox will include the Tapdaq framework and bundle to a compiled Buildbox
iOS application.

## Prerequisites

Please make sure you have node.js installed on your computer, visit
[nodejs.org](https://nodejs.org/) to find out how.

To integrate Tapdaq, you will need to obtain an Application ID and
Client Key. Please signup to [tapdaq.com](https://tapdaq.com) and add
your iOS application. The credentials can be found in the App Settings
page.

## Installation

    npm install -g tdbox

## Quickstart

The following command will integrate Tapdaq and display an interstitial
each time the application boots up. 

    tdbox YOUR_APPLICATION_ID YOUR_CLIENT_KEY

