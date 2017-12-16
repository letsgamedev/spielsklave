function SimpleJSTest () {
  let successfulTestsCount = 0
  let faildTestsCount = 0
  let failDescriptions = []

  function logResults () {
    log.black('---- Testing Results ----')
    log.black('Total tests:', successfulTestsCount + faildTestsCount)
    log.green('Successful tests:', successfulTestsCount)
    log.red('Faild tests:', faildTestsCount)
    failDescriptions.forEach((description) => log.red('Failed:', description))
    log.black('---- Testing Results End----')

    return faildTestsCount === 0
  }

  function test (description, value) {
    if (isNoValue(value)) throw new Error('There is no value givin to: ' + description)
    let isSuccessfulTest = value

    if (isSuccessfulTest) {
      addSuccess()
    } else {
      addFail()
      addFailDescription(configObject.description)
    }
  }

  function addSuccess () {
    successfulTestsCount++
  }

  function addFail () {
    faildTestsCount++
  }

  function addFailDescription (description) {
    failDescriptions.push(description)
  }

  var log = {
    print (text, colorCssCode) {
      console.log('%c ' + text.join(' '), 'color:' + colorCssCode + '; font-weight:bold;')
    },
    red (...text) {
      log.print(text, 'red')
    },
    green (...text) {
      log.print(text, 'green')
    },
    black (...text) {
      log.print(text, 'black')
    }
  }

  function isNoValue (value) {
    return value === undefined || value === null
  }

  return {
    test,
    logResults
  }
}
