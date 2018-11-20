export function createTxtFile (value, type) {
  let textFile = null
  const makeTextFile = function (text) {
    const data = new Blob([text], { type })

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile)
    }

    textFile = window.URL.createObjectURL(data)

    return textFile
  }

  return makeTextFile(value)

  // const create = document.getElementById('create')
  //
  // create.addEventListener('click', function () {
  //   const link = document.getElementById('downloadlink')
  //   link.href = makeTextFile(value)
  //   link.style.display = 'block'
  // }, false)
}
