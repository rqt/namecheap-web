import './externs'

/**
 * @implements {Test}
 */
class Example {
  api(test) {
    console.log(test)
  }
  /**
   * @nocollapse
   * @suppress {checkTypes}
   */
  static 'staticMethod'(test) {
    console.error(test)
  }
}

module.exports = Example