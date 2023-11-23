let model = undefined
// let initX
// let initY
// let positionX
// let positionY

// function nextPosition(item_list) {
//     let number = item_list.length
//     let col = Math.ceil(Math.sqrt(number))
//     positionX += 250
//     if (positionX > initX + (col - 1) * 250) {
//         positionX = initX
//         positionY += 150
//     }
// }

function paint() {
    // 1. AE -> similarity -> add/ref
    let ae_list = []

    // 1.1 Add queue
    for (let idx in model.AE.entities) {
        let start = model.AE.entities[idx].startOffset
        let end = model.AE.entities[idx].endOffset
        let name = model.text.substring(start, end)
        let type = model.AE.entities[idx].label === 1 ? "Role" : "Agent"
        ae_list.push({idx, name, type, ref: model.AE.entities[idx]})
    }

    // 1.2 Find similarity
    $.ajax("http://" + window.location.hostname + ":5050/similar", {
        data: JSON.stringify({
            entities: istar.getElements(),
            queries: ae_list,
        }),
        contentType: 'application/json',
        type: 'POST',
    }).done(paint_callback)

    function paint_callback (data) {
        // 1.3 Add elements into graph
        ae_list.forEach(function (elem) {
            let similar = false
            for (let sim_id in data) {
                if (data[sim_id][0] === elem.idx) {
                    let element =istar.getElements().find(element => element.id === data[sim_id][1])
                    if (element) {
                        elem.ref.obj = element
                        similar = true
                    }
                }
            }

            if (!similar) {
                let command = `istar.add${elem.type}("${elem.name}")`
                elem.ref.obj = eval(command)
                // nextPosition(item_list)
            }
        })

        // 2. II (Dependency & Goal) -> addGoal & addDependency
        // 3. II (Actor & Goal) -> addGoal & embed
        for (let idx in model.II.select) {
            let pid = model.II.select[idx].pid
            let oid = model.II.select[idx].oid
            let phrase = model.II.phrases.find(phrase => phrase.id === pid)
            let option = model.II.options.find(option => option.value === oid)
            // Add Goal
            let goal = eval(`istar.add${phrase.type}("${phrase.text}")`)

            // Dependency & Goal
            if (option.type === "dependency") {
                let relation = model.AR.relations.find(relation => relation.id === option.rid)
                let fromObj = model.AE.entities.find(elem => elem.id === relation.fromId).obj
                let toObj = model.AE.entities.find(elem => elem.id === relation.toId).obj
                goal.position(
                    (fromObj.position().x + toObj.position().x) / 2, (fromObj.position().y + toObj.position().y) / 2
                )
                // Add Dependency
                let dependum = istar.addDependency(fromObj, goal, toObj)
            } else {
                // Actor & Goal
                let actor = model.AE.entities.find(elem => elem.id === option.rid).obj
                goal.position(actor.position().x, actor.position().y)
                // Embed
                goal.toFront()
                istar.embedNode(goal, actor)
            }
        }

        // 4. AR (is-a/participates-in) -> addIsALink/addParticipatesInLink
        // 5. AR (unused Dependency) -> addGoal ("undefined") & addDependency
        for (let idx in model.AR.relations) {
            let relation = model.AR.relations[idx]
            let fromObj = model.AE.entities.find(elem => elem.id === relation.fromId).obj
            let toObj = model.AE.entities.find(elem => elem.id === relation.toId).obj
            // is-a/participates-in
            if (relation.labelId === 12) {
                istar.addIsALink(fromObj, toObj)
            } else if (relation.labelId === 13) {
                istar.addParticipatesInLink(fromObj, toObj)
            } else if (relation.labelId === 11) {
                // find unused Dependency
                let rid = relation.id
                // find option via rid
                let option = model.II.options.find(option => option.rid === rid)
                // find select via oid
                let select = model.II.select.find(select => select.oid === option.value)
                if (select) {
                    continue
                }

                // Add Goal ("undefined")
                let goal = istar.addGoal("undefined")
                goal.position(
                    (fromObj.position().x + toObj.position().x) / 2, (fromObj.position().y + toObj.position().y) / 2
                )
                // Add Dependency
                let dependum = istar.addDependency(fromObj, goal, toObj)
            }
        }

        // 6. IE (unused goal) -> addGoal & embed in "unspecified" Actor
        for (let idx in model.IE.entities) {
            // find unused goal
            let entity = model.IE.entities[idx]
            let rid = entity.id
            // find phrase via id
            let phrase = model.II.phrases.find(phrase => phrase.id === rid)
            // find select via pid
            let select = model.II.select.find(select => select.pid === phrase.id)
            if (select) {
                continue
            }

            // Add Goal
            let goal = eval(`istar.add${phrase.type}("${phrase.text}")`)
            // Embed in "unspecified" Actor
            let unspecified = istar.getElements().find(elem => elem.attributes.name === "unspecified")
            if (!unspecified) {
                unspecified = istar.addActor("unspecified")
            }
            goal.position(unspecified.position().x, unspecified.position().y)
            goal.toFront()
            istar.embedNode(goal, unspecified)
        }
    }
}

// TODO: Add elements with layout, just like template addition
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
                callback: paint, // function () {
                //     // istar.clearModel();
                //     item_list = []
                //
                //     // initX = 0
                //     // initY = 0
                //
                //     // find RightMost and DownMost
                //     // _.forEach(istar.getElements(), function (item) {
                //     //     let position = item.position()
                //     //     let width = item.get("size").width
                //     //     let height = item.get("size").height
                //     //     if (position.x + width > initX) {
                //     //         initX = position.x + width
                //     //     }
                //     //     if (position.y + height > initY) {
                //     //         initY = position.y + height
                //     //     }
                //     // })
                //
                //     // positionX = initX + 50
                //     // positionY = initY + 50
                //
                //     for (let idx in model.AE.entities) {
                //         let start = model.AE.entities[idx].startOffset
                //         let end = model.AE.entities[idx].endOffset
                //         let name = model.text.substring(start, end)
                //         let type = model.AE.entities[idx].label === 1 ? "Role" : "Agent"
                //         item_list.push({idx, name, type, ref: model.AE.entities[idx]})
                //         // model.AE.entities[idx].obj = eval("istar.add" + type + "(name)")
                //     }
                //     for (let idx in model.II.phrases) {
                //         let text = model.II.phrases[idx].text
                //         let type = model.II.phrases[idx].type
                //         item_list.push({idx, name: text, type: type, ref: model.II.phrases[idx]})
                //         // model.II.phrases[idx].obj = istar.addGoal(text)
                //     }
                //
                //     // Find similarity to merge nodes
                //     $.ajax("http://" + window.location.hostname + ":5050/similar", {
                //         data: JSON.stringify({
                //             entities: istar.getElements(),
                //             queries: item_list,
                //         }),
                //         contentType : 'application/json',
                //         type: 'POST',
                //     }).done(function(data) {
                //         console.dir(data)
                //
                //         // Add elements into graph
                //         _.forEach(item_list, function (elem) {
                //             let similar = false
                //             for (let sim_id in data) {
                //                 console.log(data[sim_id])
                //                 if (elem.type === "Actor" || elem.type === "Agent" || elem.type === "Role") {
                //                     if (data[sim_id][0] === elem.idx) {
                //                         console.log(elem)
                //                         let element =_.find(istar.getElements(), element => element.id === data[sim_id][1])
                //                         console.log(element)
                //                         if (element) {
                //                             elem.ref.obj = element
                //                             similar = true
                //                         }
                //                     }
                //                 }
                //
                //             }
                //
                //             if (!similar) {
                //                 let command = `istar.add${elem.type}("${elem.name}")`
                //                 elem.ref.obj = eval(command)
                //                 // nextPosition(item_list)
                //             }
                //         })
                //
                //         for (let idx in model.AR.relations) {
                //             let id = model.AR.relations[idx].id
                //             let type = model.AR.relations[idx].labelId
                //             let fromId = model.AR.relations[idx].fromId
                //             let toId = model.AR.relations[idx].toId
                //             let fromObj = model.AE.entities.find(elem => elem.id === fromId).obj
                //             let toObj = model.AE.entities.find(elem => elem.id === toId).obj
                //             let dependum
                //             if (type === 11) {
                //                 // phrases.text -> phrases.id === select.pid | select.text -> select.oid === options.id -> options.rid === AR.relations.id
                //                 let oid = model.II.options.find(elem => elem.rid === id).value
                //                 let has_dependum = false
                //                 _.forEach(model.II.select, (elem, key) => {
                //                     if (elem.oid !== oid) {
                //                         return;
                //                     }
                //                     has_dependum = true
                //                     let pid = elem.pid
                //                     if (pid === -1) {
                //                         dependum = istar.addGoal(elem.text)
                //                     } else {
                //                         dependum = model.II.phrases.find(el => el.id === pid).obj
                //                     }
                //                     istar.addDependency(fromObj, dependum, toObj)
                //                     // dependum.position(dependum.position().x + 20 * key, dependum.position().y + 20 * key)
                //                 })
                //                 if (!has_dependum) {
                //                     dependum = istar.addGoal("Unknown")
                //                     istar.addDependency(fromObj, dependum, toObj)
                //                 }
                //             } else if (type === 12) {
                //                 istar.addIsALink(fromObj, toObj)
                //             } else if (type === 13) {
                //                 istar.addParticipatesInLink(fromObj, toObj)
                //             }
                //         }
                //         for (let idx in model.II.options) {
                //             if (model.II.options[idx].type !== "inside") {
                //                 continue
                //             }
                //
                //             // phrases.obj -> phrases.id === select.pid | select.text -> select.oid === options.value -> options.rid === AE.entities.id
                //             let value = model.II.options[idx].value
                //             let rid = model.II.options[idx].rid
                //             _.forEach(model.II.select, (elem, key) => {
                //                 if (elem.oid !== value) {
                //                     return;
                //                 }
                //                 let phrase
                //                 let pid = elem.pid
                //                 if (pid === -1) {
                //                     phrase = istar.addGoal(elem.text)
                //                 } else {
                //                     phrase = model.II.phrases.find(el => el.id === pid).obj
                //                 }
                //
                //                 let actor = model.AE.entities.find(el => el.id === rid).obj
                //                 phrase.position(actor.position().x + 20 * key, actor.position().y + 20 * key)
                //                 phrase.toFront()
                //                 istar.embedNode(phrase, actor)
                //                 actor.updateBoundary()
                //             })
                //         }
                //
                //         // Move derelictions to the actor unspecified
                //         let unspecified = _.find(istar.getElements(), element => element.attributes.name === "unspecified")
                //         _.forEach(istar.getElements(), function (item, key) {
                //             if (item.isDependum()) {
                //                 return
                //             }
                //             if (!(item.isGoal() || item.isQuality() || item.isTask() || item.isResource())) {
                //                 return
                //             }
                //             if (item.isEmbedded()) {
                //                 return
                //             }
                //
                //             // TODO: find "unspecified" actor
                //             if (!unspecified) {
                //                 let command = `istar.addActor("unspecified")` // , {position: {x: ${positionX}, y: ${positionY}}})`
                //                 unspecified = eval(command)
                //             }
                //             item.toFront()
                //             item.position(
                //                 unspecified.position().x + 20 * (key + 1),
                //                 unspecified.position().y + 20 * (key + 1)
                //             )
                //             istar.embedNode(item, unspecified)
                //             unspecified.updateBoundary()
                //         })
                //     })
                // }
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
