# cypress-sugarcrm

Cypress-sugarcrm is a libray base on Cypress.io that provides commands for automating interactions with both local and on-demand SugarCRM intances. It also supports SugarCRM REST API operations.

## How to use

### Installation

To install the Cypress-SugarCRM library, run the following command.

```bash
npm install -s cypress-sugarcrm
```

### Set up
To set up user credentials, create a file named "sugarcrm-envs.json" and copy the following content:

```json
{
    "local":{
        "name": "local",
        "url": "http://my.sugar.loc",
        "users":{
            "admin":{
                "username": "myuser",
                "password": "Password123",
                "type": "admin"
            }
        }
    },
    "qa":{
        "name": "qa",
        "url": "https://instance.sugarondemand.com",
        "users":{
            "admin":{
                "username": "myuser",
                "password": "Password123",
                "type": "admin"
            }
        }
    }
}
```

**Explanation**:

* **local** and **qa**. Environment names to retrieve the corresponding information.
* **url**. The URL of the SugarCRM instances.
* **users**. Contains the credentials of the users to be used in automated test cases.

#### Cypress Configuration

In your "cypress.config.js" file, add the following configuration:

```javascript
module.exports = {
  ...
  chromeWebSecurity: false,
  ...
}
```

#### Handling Uncaught Exceptions

In the "e2e.js" file, add the following code to handle uncaught exceptions:

```javascript
...
beforeEach(function() {
    ...
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    })
    ...
})
...
```

### Using in a Spec File

In your spec file, import the Cypress-SugarCRM library as follows:

```javascript
import cySugar from "cypress-sugarcrm";
```

### Running Cypress

To run Cypress with the appropriate environment, use the following command and set the environment variable "sugarcrm_env":

```bash
npx cypress open --env sugarcrm_env=local
```

### Commands


#### Login

Log in to the SugarCRM instance using the provided username. The corresponding credential ifnromation is reatrived from the *fixtures/sugarcrm-envs.json* file.

Syntax

```javascript
    cySugar.login('admin');
```

#### Visit

Navigate to the specified SugarCRM URL and wait for the **Loading...** message disappear before proceeding to the next step.

Syntax

```javascript
    cySugar.visit('/#Accounts');
```

#### Open Sidebar Nav
Navigate to the specified SugarCRM URL and wait for the **Loading...** message disappear before proceeding to the next step.

Syntax

```javascript
    cySugar.openSidebarNav();
```

#### Open Sidebar Nav Module
Navigate to the specified SugarCRM URL and wait for the **Loading...** message disappear before proceeding to the next step.

Syntax

```javascript
    cySugar.openSidebarNavModule('Opportunities');
```

#### Set Field Value
This command sets a value in the recor view of a module using the system field name. The appropriate actions are performed base on the field's metadata type (e.g. varchar, int, enum, etc).

Syntax

```javascript
    cySugar.set_field_value('Accounts','name','Company ABC');
    cySugar.set_field_value('Accounts','email1','company@abc.com');
    cySugar.set_field_value('Accounts','external_id_c','123456');
```

#### Record Actions

#### API Call

#### Logout


