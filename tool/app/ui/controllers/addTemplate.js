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
            if (!val) return
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

$("#add-more-refinements").click(function () {
    const cells = ui.getSelectedCells()
    if (cells.length !== 1) {
        ui.alert("Please select one cell.")
        return
    }
    try {
        const element = cells[0]
        const intentions = new Set(['Task', 'Goal', 'Resource', 'Quality'])
        const type = element.prop('type')
        const name = element.prop('name')
        const position = element.prop('position')
        const canAddAndRefinement = istar.isElementTargetOfType(element, 'AndRefinementLink')
        const canAddOrRefinement = istar.isElementTargetOfType(element, 'OrRefinementLink')
        ui.states.editor.ADDING.data.intentionAddCellID = element.getParentCell().prop('id')
        ui.states.editor.ADDING.data.addRefinementTo = element

        if (intentions.has(type)) {
            if (canAddAndRefinement && !canAddOrRefinement) {
                console.log('Add And Refinement')
                ui.prompt({
                    title: `Refine ${type}: ${name}, Add AND-Refinement`,
                    inputType: 'textarea',
                    value: 'Goal: goal 1\n' +
                        'Task: task 1',
                    callback: function (val) {
                        if (!val) return
                        ui.selectPaper();
                        $('#diagram g').css('cursor', 'crosshair');
                        $('#diagram .actorKindMain').css('cursor', 'crosshair');
                        ui.states.editor.current = ui.states.editor.ADDING.ADD_REFINEMENTS_BY_TEXT
                        ui.states.editor.ADDING.data.typeNameToAdd = 'and'
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
            } else if (!canAddAndRefinement && canAddOrRefinement) {
                console.log('Add Or Refinement')
                ui.prompt({
                    title: `Refine ${type}: ${name}, Add OR-Refinement`,
                    inputType: 'textarea',
                    value: 'Goal: goal 1\n' +
                        'Task: task 1',
                    callback: function (val) {
                        if (!val) return
                        ui.selectPaper();
                        $('#diagram g').css('cursor', 'crosshair');
                        $('#diagram .actorKindMain').css('cursor', 'crosshair');
                        ui.states.editor.current = ui.states.editor.ADDING.ADD_REFINEMENTS_BY_TEXT
                        ui.states.editor.ADDING.data.typeNameToAdd = 'or'
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
            } else if (!canAddOrRefinement && !canAddOrRefinement) {
                console.log('Can add And/Or Refinement')
                bootbox.dialog({
                    title: `Refine ${type}: ${name}`,
                    message: '<iframe src="app/ui/controllers/addAndOrRefinement.html" style="width: 100%; border: none; height: 350px;"></iframe>',
                    onEscape: true,
                    buttons: {
                        ok: {
                            label: 'OK',
                            className: 'btn btn-primary bootbox-accept',
                            callback: function () {
                                const i = document.querySelector('iframe')
                                const d = i.contentWindow.document
                                const val = d.getElementById('result-box').value
                                let radio
                                try {
                                    radio = d.querySelector('input[name="refinement"]:checked').value;
                                } catch {
                                    ui.alert("Please select AND/OR Refinement you would like to add.")
                                    return
                                }
                                if (!val || !radio) return
                                ui.selectPaper();
                                $('#diagram g').css('cursor', 'crosshair');
                                $('#diagram .actorKindMain').css('cursor', 'crosshair');
                                ui.states.editor.current = ui.states.editor.ADDING.ADD_REFINEMENTS_BY_TEXT
                                ui.states.editor.ADDING.data.typeNameToAdd = radio
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
                        },
                        cancel: {
                            label: 'Cancel',
                            className: 'btn btn-secondary btn-default bootbox-cancel',
                            callback: function () {
                            }
                        }
                    }
                })
            }
        } else {
            ui.alert("Please select an intention to add more refinements by text.")
        }
    } catch {
        ui.alert("Please select a valid intention, like Goal, Task ...")
    }
})