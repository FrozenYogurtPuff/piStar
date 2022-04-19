$("#add-by-template-users-software").click(function () {
    bootbox.dialog({
        title: 'Add by template',
        message: '<iframe src="app/ui/controllers/addTemplateUsersSoftware.html" style="width: 100%; border: none; height: 350px;"></iframe>',
        onEscape: true,
        buttons: {
            ok: {
                label: 'OK',
                className: 'btn btn-primary bootbox-accept',
                callback: function () {
                    const i = document.querySelector('iframe')
                    const d = i.contentWindow.document
                    const val = d.getElementById('result-box').value
                    ui.addDependencyByText(val)
                }
            },
            cancel: {
                label: 'Cancel',
                className: 'btn btn-secondary btn-default bootbox-cancel',
                callback: function () {
                }
            }
        }
    })
})
$("#add-by-template-software-users").click(function () {
    bootbox.dialog({
        title: 'Add by template',
        message: '<iframe src="app/ui/controllers/addTemplateSoftwareUsers.html" style="width: 100%; border: none; height: 350px;"></iframe>',
        onEscape: true,
        buttons: {
            ok: {
                label: 'OK',
                className: 'btn btn-primary bootbox-accept',
                callback: function () {
                    const i = document.querySelector('iframe')
                    const d = i.contentWindow.document
                    const val = d.getElementById('result-box').value
                    ui.addDependencyByText(val)
                }
            },
            cancel: {
                label: 'Cancel',
                className: 'btn btn-secondary btn-default bootbox-cancel',
                callback: function () {
                }
            }
        }
    })
})
$("#add-by-template-owners-software").click(function () {
    bootbox.dialog({
        title: 'Add by template',
        message: '<iframe src="app/ui/controllers/addTemplateOwnersSoftware.html" style="width: 100%; border: none; height: 350px;"></iframe>',
        onEscape: true,
        buttons: {
            ok: {
                label: 'OK',
                className: 'btn btn-primary bootbox-accept',
                callback: function () {
                    const i = document.querySelector('iframe')
                    const d = i.contentWindow.document
                    const val = d.getElementById('result-box').value
                    ui.addDependencyByText(val)
                }
            },
            cancel: {
                label: 'Cancel',
                className: 'btn btn-secondary btn-default bootbox-cancel',
                callback: function () {
                }
            }
        }
    })
})