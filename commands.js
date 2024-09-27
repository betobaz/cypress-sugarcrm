import dayjs from 'dayjs';
Cypress.Commands.add("sugar_login", (username) => {	
	cy.get('@env').then((env) => {		
		Cypress.config('baseUrl', env.url)
		const current_user = env.users[username]
		cy.wrap(current_user).as("current_user")				
		const ondemand = /sugarondemand.com/;		
		if(ondemand.test(env.url)){			
			cy.origin('https://login-us-west-2.service.sugarcrm.com/', {args: {current_user, env} }, ({current_user, env}) => {
				cy.visit(env.url)
				
				cy.get('form[name=login]', {timeout:30000}).should('be.visible')	
				cy.get('form[name=login]').within(($list) => {		
					cy.on('uncaught:exception', (err, runnable) => {
						return false
					})	
					cy.get('input[name=user_name]').type(current_user.username)	
					cy.log(current_user.password)
					cy.get('input[name=password]').type(current_user.password)
					cy.get('a[name=login_button]').click()					
				})
			})			
		}
		else{
			cy.visit(env.url)
			cy.get('form[name=login]', {timeout:30000}).should('be.visible')	
            cy.log(current_user)			
			cy.get('form[name=login]', { timeout: 40000 }).within(($list) => {										
                cy.get('input[name=username]').type(current_user.username)				
				cy.get('input[name=password]').type(current_user.password)
				cy.get('a[name=login_button]').click()	
			})
		}
		cy.wait(4000)
		
		cy.url().should('include', '/#Home', {timeout:30000}).then(() =>{
			cy.window()
				.then((win) => {
					cy.wrap(win.App).as('App')	
					  cy.wrap(win.App.metadata.getModules()).as('metadata')
					  cy.wrap([
						  
					  ]).as('created_records')
					  cy.get('body').as('body')
				})
		})
	})
})

Cypress.Commands.add('cySugar', {
    prevSubject: false
  }, () => {
    return {
      login: (username) => {
        cy.cySugarcrm_login(username);
      },
      logout: () => {
        cy.cySugarcrm_login(username);
      }
    };
  });