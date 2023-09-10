import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {


    projects: [
        {
             name: "Firefox",
             use: {
                ...devices["Desktop Firefox"]
             }
        },
    ],

    testMatch: ["tests/example.test.ts"],

    use: {
        headless: true,
        screenshot: "on", 
    },

    retries: 3,

    reporter: [
      ["json", {
          outputFile: "jsonReports/jsonReport.json"
      }], 
  
      ["html", {
          open: "always"
      }]
  ]

};


export default config;