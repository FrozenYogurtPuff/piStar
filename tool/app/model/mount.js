$("#add-model-from-srs").click(function () {
    bootbox.dialog({
        title: 'Add by template',
        message: '<iframe src="app/model/view.html" style="width: 100%; border: none; height: 600px;"></iframe>',
        className: 'model-dialog',
        onEscape: false,
        buttons: {
            ok: {
                label: 'OK',
                className: 'btn btn-primary bootbox-accept',
                callback: function () {
                    const i = document.querySelector('iframe')
                    const d = i.contentWindow.document
                    // TODO: A return value
                    // const val = d.getElementById('result-box').value
                    // console.log(val)
                }
            },
            cancel: {
                label: 'Cancel',
                className: 'btn btn-secondary btn-default bootbox-cancel',
                callback: function () {
                }
            }
        }
    }).find("div.modal-dialog").css({ "width": "80%", "height": "80%" });
})
