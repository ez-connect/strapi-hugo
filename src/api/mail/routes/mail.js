module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/mail',
     handler: 'mail.send',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
