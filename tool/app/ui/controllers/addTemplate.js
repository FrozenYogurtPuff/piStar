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
$("#add-intentions-in-actor").click(function () {
    const cell = ui.getSelectedCells()
    if (cell.length !== 1) {
        ui.alert("Please select one cell.")
        return
    }
    const actors = new Set(['Actor', 'Agent', 'Role'])
    const element = cell[0]
    const type = element.prop('type')
    const name = element.prop('name')
    ui.states.editor.ADDING.data.intentionAddCellID = element.prop('id')
    if (!actors.has(type)) {
        ui.alert("Please select an Actor, an Agent or a Role.")
        return
    }

    ui.prompt({
        title: `Add Intentions in ${type}: ${name}`,
        inputType: 'textarea',
        value: 'Goal: goal 1\n' +
            'Goal: goal 2\n' +
            'Goal: goal 3\n' +
            'Task: task 1\n' +
            'Task: task 2',
        callback: function (val) {
            if (!val) {
                return
            }
            ui.selectPaper();
            $('#diagram g').css('cursor', 'crosshair');
            $('#diagram .actorKindMain').css('cursor', 'crosshair');
            ui.states.editor.current = ui.states.editor.ADDING.ADD_INTENTION_BY_TEXT
            const lines = val.trim().replace('\n\n', '\n').split('\n')
            for (let i = 0; i < lines.length; i++) {
                let type = "", name = ""
                if (lines[i].indexOf(': ') !== -1) {
                    type = lines[i].split(': ')[0]
                    name = lines[i].split(': ')[1]
                } else {
                    type = 'To-Be-Refined'
                    name = lines[i]
                }
                ui.states.editor.ADDING.data.intentionsToAdd.push({type: type, name: name})
            }
        }
    })

    /*
    bootbox.dialog({
        title: `Add Intentions in ${type}: ${name}`,
        message: '<iframe src="app/ui/controllers/addTemplateIntentionsInActor.html" style="width: 100%; border: none; height: 350px;"></iframe>',
        onEscape: true,
        buttons: {
            ok: {
                label: 'OK',
                className: 'btn btn-primary bootbox-accept',
                callback: function () {
                    const i = document.querySelector('iframe')
                    const d = i.contentWindow.document
                    const val = d.getElementById('result-box').value
                    // TODO: Get val and do things...
                    ui.selectPaper();
                    $('#diagram g').css('cursor', 'crosshair');
                    $('#diagram .actorKindMain').css('cursor', 'crosshair');
                    ui.states.editor.current = ui.states.editor.ADDING.ADD_INTENTION_BY_TEXT
                    const lines = val.trim().replace('\n\n', '\n').split('\n')
                    for (let i = 2; i < lines.length; i++) {
                        let type = "", name = ""
                        if (lines[i].indexOf(': ') !== -1) {
                            type = lines[i].split(': ')[0]
                            name = lines[i].split(': ')[1]
                        } else {
                            type = 'To-Be-Refined'
                            name = lines[i]
                        }
                        console.log(type, name)
                        ui.states.editor.ADDING.data.intentionsToAdd.push({type: type, name: name})
                    }
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
    */
})