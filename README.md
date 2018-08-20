# [jsdom-browser.screen-orientation][repo-url] [![NPM][npm-img]][npm-url] [![MIT License][mit-img]][mit-url] [![WPT][wpt-img]][wpt-url] [![Build Status][travis-img]][travis-url] [![Build Status][appveyor-img]][appveyor-url] [![Coverage Status][coverage-img]][coverage-url]

The implementation of [the Screen Orientation API][spec-url] for [jsdom-browser][jsdom-browser-url].

[jsdom-browser][jsdom-browser-url] is a simulator of a Web browser with [JSDOM][jsdom-url].

> This module is implemented along the [Screen Orientation API on 06 July 2018][spec-url]. This specification may become older than the [latest version][latest-spec-url].

## Install

```sh
$ npm install jsdom-browser.screen-orientation
```

## Usage

### Creates and updates the current orientation type and angle 

Creates a ScreenOrientation object and its config object:

```js
const { ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientation, ScreenOrientationConfig } = require('jsdom-browser.screen-orientation')

const { JSDOM } = require('jsdom')
const window = new JSDOM().window

const screenConfig = new ScreenConfig({ width: 768, height: 1024 })
screenConfig.configure(window.screen)

const orientationConfig = new ScreenOrientationConfig(screenConfig, {
  relationsOfTypeAndAngle: {
    'landscape-primary': 0,
    'portrait-primary': 90,
    'landscape-secondary': 180,
    'portrait-secondary': 270,
  }
})
const orientation = ScreenOrientation.create([], {
  associatedDocument: window.document,
})
orientationConfig.configure(orientation)
window.screen.orientation = orientation


orientation.addEventListener('change', () => {
  console.log(`Orientation was changed: ${orientation.type}`);
})
orientation.onchange = () => {
  console.log(`Orientation was changed (onchange): ${orientation.type}`);
}
orientationConfig.on('change', cfg => {
  console.log(`Orientation was changed (config): ${cfg.currentType}`)
})
```

Gets the current orientation type and angle:

```js
window.screen.width // => 1024
window.screen.height // => 768
window.screen.orientation.type  // => 'landscape-primary'
window.screen.orientation.angle // => 0

screenConfig.width // => 768
screenConfig.height // => 1024
screenConfig.deviceAngle // => 0
screenConfig.screenAngle // => 0
screenConfig.baseAngle   // => 90

orientationConfig.currentType // => 'landscape-primary'
orientationConfig.currentAngle // => 0
orientationConfig.orientations
// => ['portrait-primary', 
//     'landscape-primary',
//     'portrait-secondary',
//     'landscape-secondary' ]
```

Simulates of rotating screen:

```js
screenConfig.deviceAngle = 110
orientationConfig.handleRotation()

window.screen.width // => 768
window.screen.height // => 1024
window.screen.orientation.type  // => 'portrait-primary'
window.screen.orientation.angle // => 90

screenConfig.width // => 768
screenConfig.height // => 1024
screenConfig.deviceAngle // => 110
screenConfig.screenAngle // => 90
screenConfig.baseAngle   // => 90

orientationConfig.currentType // => 'portrait-primary'
orientationConfig.currentAngle // => 90
orientationConfig.orientations
// => ['portrait-primary', 
//     'landscape-primary',
//     'portrait-secondary',
//     'landscape-secondary' ]
```

The output to console is as follows:

```sh
Orientation was changed (config): portrait-primary
Orientation was changed: portrait-primary
Orientation was changed (onchange): portrait-primary
```

### Lock the orientation

```js
orientation.lock('landscape').then(() => {
  console.log('Orientation was locked')

  window.screen.width // => 1024
  window.screen.height // => 768
  window.screen.orientation.type  // => 'landscape-primary'
  window.screen.orientation.angle // => 0

  screenConfig.width // => 768
  screenConfig.height // => 1024
  screenConfig.deviceAngle // => 110
  screenConfig.screenAngle // => 0
  screenConfig.baseAngle   // => 90

  orientationConfig.currentType // => 'landscape-primary'
  orientationConfig.currentAngle // => 0

  orientationConfig.orientations
  // => ['landscape-primary',
  //     'landscape-secondary']
}).catch(() => {
  console.log('Orientation lock was rejected')
})
```

The output to console is as follows:

```
Orientation was locked
Orientation was changed (config): landscape-primary
Orientation was changed: landscape-primary
Orientation was changed (onchange): landscape-primary
```

### Unlock the orientation

```js
orientation.unlock()

window.screen.width // => 1024
window.screen.height // => 768
window.screen.orientation.type  // => 'landscape-primary'
window.screen.orientation.angle // => 0

screenConfig.width // => 768
screenConfig.height // => 1024
screenConfig.deviceAngle // => 110
screenConfig.screenAngle // => 0
screenConfig.baseAngle   // => 90

orientationConfig.currentType // => 'landscape-primary'
orientationConfig.currentAngle // => 0

orientatonConfig.orientations
// => ['portrait-primary',
//     'landscape-primary',
//     'portrait-secondary',
//     'landscape-secondary' ]
```


## API

### <u>class ScreenOrientation : EventTarget</u>

Is an implementation of ScreenOrientation API.

#### Properties:

| Name     |  Type  | Description   |
|:---------|:------:|:--------------|
| type     | string | The current orientation type. (read only) |
| angle    | number | The current orientation angle. (read only ) |
| onchange | function | The `change` event handler.  |

#### lock (lockType) => Promise

Locks the orientation to an orientation type set associated with the specified orientation lock type.

##### Parameters:

| Parameter  | Type   | Description                |
|:-----------|:------:|:---------------------------|
| *lockType* | string | An orientation lock type   |

##### Returns:

A promise object


#### unlock () => Void

Locks the orientation to default orientation set.


### <u>class ScreenOrientationConfig</u>

Is a configuration class to configure a ScreenOrientation object.

#### Properties:

| Name         |  Type  | Description           |
|:-------------|:------:|:----------------------|
| currentType  | string | The current orientation type.  |
| currentAngle | number | The current orientation angle. |
| onchange     | function | The `change` event handler.  |
| orientations | Array  | The current orientation lock types. |
| defaultOrientation | Array | The orientation lock types in default and when unlocked. |
| isSupportLocking | boolean | The flag to simulate user agent which is not support locking. (`false` in default) |
| isSecurityError | boolean | The flag to simulate behavior that user agent doesn't meet the security conditions. (`false` in default) |
| isActiveOrientationLock | boolean | The flag to simulte behavior of inactive orientation lock. (`true` in default) |

#### constructor (screenConfig, initConfig) => ScreenOrientationConfig

Creates an instance of this class.
This constructor requires *screenConfig* as the first argument to get its device angle, screen angle and orientation config array of which elements are the `ScreenOrientationConfig` objects dangled a same top window.
Also, this constructor can accept *initConfig* as the second argument to configure this instance.

##### Parameters:

| Parameter      | Type           | Description     |
|:---------------|:--------------:|:----------------|
| *screenConfig* | `ScreenConfig` | The config object of `window.screen` |
| *initConfig*   | object &#124; `ScreenOrientationConfig` | The initial configuration object of which properties are as follows. |

* **Properties of <i>initConfig</i>**

    > See `./src/default.js`

    | Name        |  Type  | Description   |
    |:------------|:------:|:--------------|
    | deviceAngle | number | An angle of device which is used when updating orientation. |
    | relationsOfTypeAndAngle | object | A mapping of orientation types and orientation angles. |
    | defaultOrientation | Array | An array of orientation types when orientation is unlocked. |
    | isSecurityError | boolean | A flag to cause a security error forcely when locking. |
    | isActiveOrientationLock | boolean | A flag to abort locking because of not active orientatin lock. |
    | messages    | object | Messages for some errors. |
 
#### update () => Void

Updates the orientation type and angle with the device angle of the `ScreenConfig` object and the `orientations` property of this object.

This method fires no `change` event even if this orientation type is changed.

#### handleRotation () => Void

Updates the orientation type and angle with the device angle of the `ScreenConfig` object and the `orientations` property of this object.

This method fires `change` events to the orientations associated with the current document, the top document and the all other descendant documents of the top document if this orientation type is changed.

#### handleVisible () => Void

Updates the orientation type and angle with the device angle of the `ScreenConfig` object and the `orientations` property of this object.

This method fires a `change` event to the current orientation if this orientation type is changed.

#### on (eventName, handler) => Void

Registers an event handler of an event of which name is `eventName`.


## WebIDL

> See [the Screen Orientation API][webidl-url],

```
[Exposed=Window]
interface ScreenOrientation : EventTarget {
  Promise<void> lock(OrientationLockType orientation);
  void unlock();
  readonly attribute OrientationType type;
  readonly attribute unsigned short angle;
  attribute EventHandler onchange;
};
```


## License

Copyright (C) 2018 Takayuki Sato

This program is free software under [MIT][mit-url] License.
See the file LICENSE in this distribution for more details.


[repo-url]: https://github.com/sttk/jsdom-browser.screen-orientation/

[npm-img]: https://img.shields.io/badge/npm-v0.1.0-blue.svg
[npm-url]: https://www.npmjs.org/package/jsdom-browser.screen-orientation/

[mit-img]: https://img.shields.io/badge/license-MIT-green.svg
[mit-url]: https://opensource.org/licenses.MIT

[wpt-img]: https://img.shields.io/badge/web--platform--tests-pass-brightgreen.svg
[wpt-url]: https://github.com/web-platform-tests/wpt

[travis-img]: https://travis-ci.org/sttk/jsdom-browser.screen-orientation.svg?branch=master
[travis-url]: https://travis-ci.org/sttk/jsdom-browser.screen-orientation

[appveyor-img]: https://ci.appveyor.com/api/projects/status/github/sttk/jsdom-browser.screen-orientation?branch=master&svg=true
[appveyor-url]: https://ci.appveyor.com/project/sttk/jsdom-browser.screen-orientation

[coverage-img]: https://coveralls.io/repos/github/sttk/jsdom-browser.screen-orientation/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/sttk/jsdom-browser.screen-orientation?branch=master

[spec-url]: https://www.w3.org/TR/2018/WD-screen-orientation-20180706/
[latest-spec-url]: https://www.w3.org/TR/screen-orientation/
[webidl-url]: https://www.w3.org/TR/2018/WD-screen-orientation-20180706/#idl-def-screenorientation

[jsdom-url]: https://github.com/jsdom/jsdom
[jsdom-browser-url]: https://github.com/sttk/jsdom-browser
[jsdom-browser-screen-url]: https://github.com/sttk/jsdom-browser.screen

