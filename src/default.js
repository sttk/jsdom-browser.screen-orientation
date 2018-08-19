'use strict'

module.exports = {
  // (3.2) #screenorientation-interface
  // (3.3) #orientationtype-enum
  // (4.1) #reading-the-screen-orientation
  relationsOfTypeAndAngle: {
    'landscape-primary': 0,
    'portrait-primary': 90,
    'landscape-secondary': 180,
    'portrait-secondary': 270,
  },

  // (3.2) #screenorientation-interface
  defaultOrientation: [
    'portrait-primary',
    'landscape-primary',
    'portrait-secondary',
    'landscape-secondary',
  ],

  // (4.2) #locking-the-screen-orientation
  isSupportedLocking: true,

  // (4.2) #locking-the-screen-orientation
  isSecurityError: false,

  // (4.2) #locking-the-screen-orientation
  // (4.3) #screen-orientation-lock-lifetime
  isActiveOrientationLock: true,

  message: {
    lockNotSupportedError:
      'screen.orientation.lock() is not available on this device.',
    lockSecurityError:
      'screen.orientation.lock() causes a security error.',
    lockAbortError:
      'screen.orientation.lock() was aborted.',
    lockInvalidLockType:
      'screen.orientation.lock() causes an error: invalid type.',
  }
}
