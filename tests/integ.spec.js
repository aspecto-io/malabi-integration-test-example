const axios = require('axios').default;
const { fetchRemoteTelemetry, clearRemoteTelemetry } = require('malabi');
const getMalabiTelemetryRepository = async () => await fetchRemoteTelemetry({ portOrBaseUrl: 18393 });

describe('testing service-under-test remotely', () => {
  beforeEach(async () => {
    // We must reset all collected spans between tests to make sure span aren't leaking between tests.
    await clearRemoteTelemetry({ portOrBaseUrl: 18393 });
  });

  it('successful /todo request', async () => {
    // simulate login
    const loginRes = await axios.post(`http://localhost:3000/auth/login`, { username: 'tom@a.com', password: 'password' });
    const authCookie = loginRes.headers['set-cookie'];

    // call to the service under test - internally it will call another API to fetch the todo items.
    await axios(`http://localhost:3000/todos/`, { headers: {
        Cookie: authCookie
    } });

    // Get instrumented spans
    const repo = await getMalabiTelemetryRepository({ portOrBaseUrl: 13893 });
    const dbSpan = repo.spans.mongo();
    console.log('dbSpan.first', dbSpan.first);
    const emailUsedInMongoQuery = JSON.parse(dbSpan.first.dbStatement).condition.email;

    // Assert that mongo query got the correct email
    expect(emailUsedInMongoQuery).toEqual("tom@a.com")
  });
});