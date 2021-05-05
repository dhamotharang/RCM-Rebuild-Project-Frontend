const baseUrl = '54.151.222.224:8080';

export const environment = {
  production: false,
  farmerApi: `http://${baseUrl}/v1/rcmffr/farmers`,
  fieldApi: `http://${baseUrl}/v1/rcmffr`,
  authApi: `http://${baseUrl}/v1/rcmuser/login`,
  googleMapsApiKey: 'AIzaSyCS_20S8igs7tRNXPFOG3AYcjTb-rBaIkk',
  userApi: `http://${baseUrl}/v1/rcmffr/users`,
  historyApi: `http://${baseUrl}/v1/rcmffr/datahistories`,
  dataPrivacyApi: `http://${baseUrl}/v1/rcmffr/dataprivacy`,
  logApi: `http://${baseUrl}/v1/rcmffr/logs`,
  dataEditApi: `http://${baseUrl}/v1/rcmffr/data_edits/total`,
  barangayApi: `http://${baseUrl}/v1/rcmffr/barangays`,
  gpxApi: `http://${baseUrl}/v1/rcmffr/gpx-upload`,
  apiForInterviewed: `http://${baseUrl}/v1/rcmffr/interviewed`,
  anPotentialYieldApi: `http://${baseUrl}/v1/rcmffr/anpotentialyield`,
  regionsApi: `http://${baseUrl}/v1/rcmffr/regions`,
  provincesApi: `http://${baseUrl}/v1/rcmffr/provinces`,
  municipalitiesApi: `http://${baseUrl}/v1/rcmffr/municipalities`,
  offlineApi: `http://${baseUrl}/v1/rcmffr/offline`,
  varietyApi: `http://${baseUrl}/v1/rcmffr/variety`,
  //refactored
  apiBaseUrl: 'http://54.151.222.224:8080'
};
