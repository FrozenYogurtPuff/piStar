let model = undefined

$("#add-model-from-srs").click(function () {
    window.addEventListener('message', function (e) {
        const data = e.data
        if ("text" in data) {
            model = data
            console.log(model)
        }
    });
    bootbox.dialog({
        title: 'Add by template',
        message: '<iframe src="app/model/dist/index.html" style="width: 100%; border: none; height: 600px;"></iframe>',
        className: 'model-dialog',
        onEscape: false,
        buttons: {
            ok: {
                label: 'OK',
                className: 'btn btn-primary bootbox-accept',
                callback: function () {
                    istar.clearModel();
                    for (let idx in model.AE.entities) {
                        let start = model.AE.entities[idx].startOffset
                        let end = model.AE.entities[idx].endOffset
                        let name = model.text.substring(start, end)
                        let type = model.AE.entities[idx].label === 1 ? "Role" : "Agent"
                        model.AE.entities[idx].obj = eval("istar.add" + type + "(name)")
                    }
                    for (let idx in model.II.phrases) {
                        let text = model.II.phrases[idx].text
                        model.II.phrases[idx].obj = istar.addGoal(text)
                    }
                    for (let idx in model.AR.relations) {
                        let id = model.AR.relations[idx].id
                        let type = model.AR.relations[idx].labelId
                        let fromId = model.AR.relations[idx].fromId
                        let toId = model.AR.relations[idx].toId
                        let fromObj = model.AE.entities.find(elem => elem.id === fromId).obj
                        let toObj = model.AE.entities.find(elem => elem.id === toId).obj
                        if (type === 11) {
                            // phrases.ans === options.value -> options.rid === AR.relations.id
                            let ans = model.II.options.find(elem => elem.rid === id).value
                            let dependum = model.II.phrases.find(elem => elem.ans === ans).obj
                            istar.addDependency(fromObj, dependum, toObj)
                        } else if (type === 12) {
                            istar.addIsALink(fromObj, toObj)
                        } else {
                            istar.addParticipatesInLink(fromObj, toObj)
                        }
                    }
                    for (let idx in model.II.options) {
                        if (model.II.options[idx].type !== "inside") {
                            continue
                        }

                        // phrases.ans === options.value -> options.rid === AE.entities.id
                        let value = model.II.options[idx].value
                        let rid = model.II.options[idx].rid
                        console.log(model.II.phrases)
                        console.log(value)
                        let res = model.II.phrases.find(elem => elem.ans === value)
                        let obj
                        if (res) {
                            obj = res.obj
                        } else {
                            continue
                        }
                        let actor = model.AE.entities.find(elem => elem.id === rid).obj
                        istar.embedNode(obj, actor)
                    }
                    // istar.fileManager.loadModel(tempLoadFile);
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
