# GAZO Store
Data store related functions.

## Install
```bash
npm install gazo-store --save
```

## Use
```javascript
const store = require('gazo-store').connect(options)
```

### Add data to the store
```javascript
store.add('user', {username: 'johndoe'})
```

### Find all
```javascript
store.findAll('user')
```

### Find by id
```javascript
store.find('user', 'c2ec6c39-1776-49b3-8eff-7ff13818aafc')
```
