# GAZO Store
Data store related functions.

## Install
```bash
npm install gazo-store --save
```

## Use
```javascript
const Store = require('gazo-store')('example-project', 'user-management-service')
```

### Save data
```javascript
Store.save('user', {username: 'johndoe'})
```
