class cySugar{

	login(username) {
		cy.fixture('sugarcrm-envs')
		.then(function(envs){
			const sugarcrm_env = Cypress.env("sugarcrm_env")
			this.sugarcrm_env = envs[sugarcrm_env];
			cy.wrap(this.sugarcrm_env).as('sugarcrm_env');    
		})
		cy.get('@sugarcrm_env').then((env) => {		
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
	}

	logout() {
		cy.visit(`#logout/?clear=1`)
		cy.get('.welcome', { timeout: 40000 }).should('exist')
	}

	visit (url) {	
		cy.visit(url)	
		cy.get('#alerts div.alert.alert-process', {timeout:30000}).should('be.visible')	
		cy.get('#alerts div.alert.alert-process', {timeout:90000}).should('not.exist')
		cy.wait(2000)
	}
	
	record_actions (action = false) {	
		cy.get(`.headerpane .btn-toolbar`).within(($toolbar) => {		
			if(action){
				cy.contains(action).click({force:true})	
			}
		})
	}
	
	// Cypress.Commands.add("record_more_actions", (action = false) => {	
	// 	cy.get(`.headerpane .btn-toolbar .actions`).within(($actions) => {
	// 		cy.get(`a.dropdown-toggle`).click({force:true})
	// 		if(action){
				
	// 			cy.get(`ul li:contains("${action}") a`).click()
	// 		}
	// 	})
	// })
	
	// Cypress.Commands.add("menu_more_actions", (module) => {	
	// 	cy.get(`#header .nav.megamenu > li[data-module="${module}"] button`).click()
	// })
	
	
	// Cypress.Commands.add("getModuleMetadata", (module_name) => {
	// 	return cy.window().then((win) => {
	// 		return cy.wrap(win.App.metadata.getModule(module_name))
	// 	})
	// })
	click_create(){
		cy.get('[name="create_button"]').click();
	}
	
	click_record_edit(){
		cy.get('.main-pane [name="edit_button"]').click();
	}

	click_record_save(){
		cy.get('.main-pane [name="save_button"]').click();
	}

	check_update_open_revelue_line_items(field_name){
		cy.get(`.record .record-cell[data-name="${field_name}"] input:checkbox`).click()
	}

	save_new_bean(timeout=1000, close_alert=false){
		cy.get("#drawers .drawer.active").within(($drawer) => {
			cy.get('a[name="save_button"]').click()
		})
		
		
		cy.get('#alerts .alert-success', {timeout:timeout})
			.should('be.visible')
			.and('contain', 'You successfully created')
	
		cy.get('#alerts div.alert.alert-success').find("a").then(($a) => {
			let href = Cypress.$($a).attr("href").split("/");
			cy.wrap({id:href[1]}).as("new_record_id")
		})

		cy.get('#alerts div.alert.alert-success .close').click()
		// cy.pause()}}
		cy.wait(1000)
		return cy.get("@new_record_id")
	}
	
	// Cypress.Commands.add("selectEnumOption", (field_name, option) => {
	select_enum_option(field_name, option) {
		cy.get(`[data-fieldname="${field_name}"] a.select2-choice`).click()
		cy.get('@body').find('div#select2-drop.select2-drop-active', {timeout:3000}).within(($selec2_results) => {
			cy.contains(option).click()
		})
		return cy.get(`[data-fieldname="${field_name}"]`)
	}
	
	// Cypress.Commands.add("unselectMultiEnumOption", (field_name, option) => {
	// 	cy.get(`[data-fieldname="${field_name}"]`).contains('li',option).find('a').click()
	// 	return cy.get(`[data-fieldname="${field_name}"]`)
	// })
	
	// Cypress.Commands.add("selectMultiEnumOption", (field_name, option) => {
	// 	cy.get(`[data-fieldname="${field_name}"] ul.select2-choices`).click({force:true})
	// 	cy.get('@body').find('div#select2-drop.select2-drop-active').within(($selec2_results) => {
	// 		cy.contains(option).click()
	// 	})
	// 	return cy.get(`[data-fieldname="${field_name}"]`)
	// })
	
	// Cypress.Commands.add("selectRelateOption", (field_name, option) => {
	select_relate_option(field_name, option, on_table = false) {
		debugger
		if(on_table){
			cy.get(`[name="${field_name}"]`).parent().find(`a.select2-choice`).click()
		}
		else{
			cy.get(`[data-fieldname="${field_name}"] a.select2-choice`).click()
		}
		cy.get('@body').find('div#select2-drop.select2-drop-active').within(($selec2_results) => {
			cy.get(`input.select2-input`).type(option)
			cy.get(`li.select2-result-selectable:contains(${option})`, {timeout:10000}).click()
		})
		if(on_table){
			return cy.get(`[name="${field_name}"]`)
		}
		else{
			return cy.get(`[data-fieldname="${field_name}"]`)
		}
	}
	
	// Cypress.Commands.add("newBeanFromSubpanel", (link) => {
	// 	cy.get(`[data-subpanel-link="${link}"] a[name="create_button"]`).click({force:true})
	// 	return cy.get("#drawers .drawer.active")
	// })
	
	// Cypress.Commands.add("openRecordBean", (module_name, id) => {
	// 	cy.visit(`/#${module_name}/${id}`)
	// 	cy.get('#alerts div.alert.alert-process', {timeout:10000})
	// 		.should('not.be.visible')
	// })
	// Cypress.Commands.add("listViewCreateFilter", (field, operator, value) => {
	// 	cy.get('.search-filter').within(($searchFilter) => {
	// 		cy.get('.choice-filter-clickable').click()
	// 		cy.get('.filter-body .row-fluid:eq(0) div[data-filter="field"] a.select2-choice').click()
	// 		cy.get('@body').find('div#select2-drop.select2-drop-active').within(($selec2_results) => {
	// 			cy.get(`input.select2-input`).type(field)
	// 			cy.get(`li.select2-result-selectable:contains(${field})`, {timeout:10000}).click()
	// 		})
	// 		cy.get('.filter-body .row-fluid:eq(0) div[data-filter="operator"] a.select2-choice').click()
	// 		cy.get('@body').find('div#select2-drop.select2-drop-active').within(($selec2_results) => {			
	// 			cy.get(`li.select2-result-selectable:contains(${operator})`, {timeout:10000}).click()
	// 		})
	// 		cy.get('.filter-body .row-fluid:eq(0) div[data-filter="value"] input').type(value)		
	// 	})
	// 	cy.get('#alerts div.alert.alert-process', {timeout:30000}).should('be.visible')	
	// 	cy.get('#alerts div.alert.alert-process', {timeout:90000}).should('not.exist')	
	// })
	
	
	// Cypress.Commands.add("subpanel_expand", (link) => {	
	// 	cy.get(`#content div[data-subpanel-link=${link}]`, {timeout:30000}).within(($subpanel) => {
	// 		cy.get('li.subpanel').within(($li) => {
	// 			if($li.hasClass('closed')){
	// 				$li.find('div.subpanel-header').click()
	// 			}
	// 		})
	// 	})
	// })
	
	// Cypress.Commands.add("listview_select_all", () => {	
	// 	cy.get('.main-content table.dataTable thead span.actionmenu input:checkbox').check()
	// })
	
	// Cypress.Commands.add("listview_more_actions", (action) => {	
	// 	cy.get('.main-content table.dataTable thead span.actionmenu').within( (actionmenu) => {
	// 		cy.get('a.dropdown-toggle').click()
	// 		cy.get(`ul.dropdown-menu li:contains(${action})`).click()
	// 	})	
	// })
	
	// Cypress.Commands.add("listview_mass_update_field", (module, field_name, value, click_save) => {	
	// 	cy.get("@App").then((app) => {
	// 		cy.get('@metadata').then((metadata) => {
	// 			const field = metadata[module].fields[field_name]	
	// 			const field_label = app.lang.getModString(field.vname, module)
	// 			cy.log(field_label)	
	// 			cy.get('.filter-body').within( (actionmenu) => {
	// 				cy.get('.row-fluid:eq(0) div.filter-field a.select2-choice').click()
	
	// 				cy.get('@body').find('div#select2-drop.select2-drop-active').within(($selec2_results) => {
	// 					cy.get(`input.select2-input`).type(field_label)
	// 					cy.get(`li.select2-result-selectable:contains(${field_label}):eq(0)`, {timeout:10000}).click()
	// 				})
	
	// 				switch(field.type){
	// 					case "enum":
	// 						cy.get('.row-fluid:eq(0) div.filter-value a.select2-choice').click()	
	// 						cy.get('@body').find('div.select2-drop-active', {timeout:3000}).within(($selec2_results) => {
	// 							cy.contains(value).click()
	// 						})
	// 					break;
	// 				}
	// 			})
	// 			if(click_save){
	// 				cy.get('.filter-header a[name=update_button]').click()				
	// 			}
	// 		})	
	// 	})	
	
	// })
	
	
	api_call (method, url, data, headers = {}) {	
		return cy.get("@App").then((app) => {
			headers["OAuth-Token"] = app.api.getOAuthToken()
			headers["Content-Type"] = "application/json"
			return cy.request({
				url: `/rest/v11_14/${url}`,
				method: method,
				headers: headers,
				body: data
			})
		})
	}
	
	// Cypress.Commands.add('getIframeBody', (iframe_selector) => {
	// 	return cy
	// 	.get(iframe_selector)
	// 	.its('0.contentDocument.body').should('not.be.empty')
	// 	.then(cy.wrap)
	//   })
	
	//   Cypress.Commands.add("set_field_value", (module, field_name, value) => {	
	set_field_value (module, field_name, value, on_table = false) {	
		cy.get('@metadata').then((metadata) => {
			const field = metadata[module].fields[field_name]		
			switch(field.type){
				case "varchar":
				case "name":
				case "phone":			
				case "date":
				case "decimal":
				case "int":			
				case "currency":	
					if(field.group){	
						cy.get(`div.fieldset-field[data-name=${field_name}] input[type=text][name=${field_name}]`).clear().type(value)
					}
					else{
						if(on_table){
							cy.get(`input[type=text][name=${field_name}]`).clear().type(value)
						}
						else{
							cy.get(`.record-cell[data-name=${field_name}] input[type=text][name=${field_name}]`).clear().type(value)
						}
					}
				break
				case "text":	
					if(field.group){
						cy.get(`div.fieldset-field[data-name=${field_name}] textarea`).clear().type(value)
					}
					else{
						cy.get(`.record-cell[data-name=${field_name}] textarea`).clear().type(value)
					}				
				break
				case "enum":
					this.select_enum_option(field_name, value)
				break;
				case "relate":
					this.select_relate_option(field_name, value, on_table)
				break;
				case "bool":
					if(value){
						cy.get(`.record-cell[data-name=${field_name}] input[type=checkbox]`).check()
					}
					else{
						cy.get(`.record-cell[data-name=${field_name}] input[type=checkbox]`).uncheck()
					}				
				break;
				case "email":
					cy.get(`.record-cell[data-name=${field_name}] input[type=text]`).clear().type(value)
				break;
				default:
					cy.log(`set_field_value Not implement ${field.type}`)
				break;
			}
		})
	}
	
	// Cypress.Commands.add("record_expand_panel", (name) => {	
	// 	cy.get(`.record-panel span.record-panel-header:contains(${name})`).click()
	// })
	
	
	// Cypress.Commands.add("get_record", (module, id) => {		
	// 	return cy.get("@App").then((app) => {
	// 		return cy.request({
	// 			url: `/rest/v11_1/${module}/${id}`,
	// 			method: 'GET',
	// 			headers: {
	// 				"OAuth-Token": app.api.getOAuthToken()
	// 			},
	// 		})
	// 	})
	// })
	
	// Cypress.Commands.add("record_chageselect_tab", (tab_name) => {
	// 	cy.get(`.content-tabs li span:contains("${tab_name}")`).click()
	// })
	
	open_sidebar_nav(){
		cy.get('#sidebar-nav .collapsed .sicon-hamburger-lg').click()
	}

	open_sidebar_nav_module(moduleName){
		this.open_sidebar_nav();
		cy.get(`#sidebar-nav .sidebar-nav-item:contains(${moduleName})`).click()
	}

	set_values(moduleName, data){
		// cy.wrap(null).then(()=>{
			Object.keys(data).forEach(key => {
				this.set_field_value(moduleName,key,data[key])
			});
		// })
		
	}

	rli_set_values(index, data, addNewLine = false){
		const moduleName = "RevenueLineItems";
		if(addNewLine){
			var prevLine = index-1;
			cy.get(`[data-subpanel-link="revenuelineitems"] tbody tr:eq(${prevLine}) .addBtn`).click()
		}
		cy.get(`[data-subpanel-link="revenuelineitems"] tbody tr:eq(${index})`).within((tr) => {
			Object.keys(data).forEach(key => {
				this.set_field_value(moduleName, key, data[key], true)
			});
		})
	}
};
	
export default new cySugar;