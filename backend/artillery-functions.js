// Helper functions for Artillery load testing

module.exports = {
  generateRandomString,
  generateRandomNumber,
  generateRandomEmail,
};

function generateRandomString(userContext, events, done) {
  userContext.vars.randomString = Math.random().toString(36).substring(7);
  return done();
}

function generateRandomNumber(userContext, events, done) {
  userContext.vars.randomNumber = Math.floor(Math.random() * 100);
  return done();
}

function generateRandomEmail(userContext, events, done) {
  const random = Math.random().toString(36).substring(7);
  userContext.vars.randomEmail = `test_${random}@example.com`;
  return done();
}
