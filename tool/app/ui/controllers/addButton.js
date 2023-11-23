/*!
 * This is open-source. Which means that you can contribute to it, and help
 * make it better! Also, feel free to use, modify, redistribute, and so on.
 *
 * If you are going to edit the code, always work from the source-code available for download at
 * https://github.com/jhcp/pistar
 */

ui.components = ui.components || {};  //prevents overriding the variable, while also preventing working with a null variable

ui.components.createAddButtons = function () {
    'use strict';

    //create the ADD buttons

    //create Add <<Container>> buttons
    if (istar.metamodel.containers) {
        _.forEach(istar.metamodel.containers, function (elementType) {
            //if specific ui elements are not defined, use default ones
            var label = elementType.buttonLabel || elementType.name;
            var tooltip = elementType.buttonTooltip || ('Add ' + elementType.name);
            var statusText = elementType.buttonStatusText || ('Adding <b>' + elementType.name + '</b>: click on an empty space in the diagram to add a new ' + elementType.name);
            var image = elementType.name;

            new ui.components.AddButtonDropdownItemView({
                attributes: {parent: '#add-actor-dropdown'}, model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_CONTAINER,
                    buttonImage: image,
                    defaultButtonImage: 'DefaultContainer.svg',
                    label: label,
                    name: elementType.name,
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        });

        // Add Actor with rectangle layout
        let positionX = 0
        let positionY = 0
        let initX = 0
        let initY = 0

        ui.setInitPosition = function setInitPosition(x, y) {
            positionX = x
            positionY = y
            initX = x
            initY = y
        }

        function nextPosition() {
            let number = elementsToAdd.length
            let col = Math.ceil(Math.sqrt(number))
            positionX += 250
            if (positionX > initX + (col - 1) * 250) {
                positionX = initX
                positionY += 150
            }
        }

        function getTypeName(line) {
            line = line.trim()
            const type = line.split(' ')[0]
            const name = line.substring(line.indexOf(' ') + 1, line.length)
            return {type: type, name: name}
        }

        function setAddState() {
            ui.selectPaper();
            ui.states.editor.current = ui.states.editor.ADDING.ADD_BY_TEXT
            $('#diagram').css('cursor', 'crosshair');
            $('#diagram g').css('cursor', 'no-drop');
            $('#diagram .actorKindMain').css('cursor', 'no-drop');
        }

        // Add Actor by text by given type and name, with auto layout
        function addElement(type, name) {
            try {
                name = name.trim()
                let r;
                switch (type) {
                    case 'Actor':
                        r = istar.addActor(name, {position: {x: positionX, y: positionY}})
                        nextPosition()
                        break
                    case 'Agent':
                        r = istar.addAgent(name, {position: {x: positionX, y: positionY}})
                        nextPosition()
                        break
                    case 'Role':
                        r = istar.addRole(name, {position: {x: positionX, y: positionY}})
                        nextPosition()
                        break
                    default:
                        ui.alert('INVALID: Sorry, but one of the actor you are trying to create is invalid');
                        break
                }
                if (r) {
                    istar.resizePaperBasedOnCell(r)
                }
            } catch (e) {
                console.error(e)
                ui.alert('INVALID: Sorry, but one of the actor you are trying to create is invalid');
                ui.clearElements();
            }
        }

        let elementsToAdd = []

        ui.addElements = function addElements() {
            _.forEach(elementsToAdd, function (element) {
                addElement(element.type, element.name)
            })
        }

        // Reset status
        ui.clearElements = function () {
            elementsToAdd = []
            ui.states.editor.transitionTo(ui.states.editor.VIEWING);
            ui.resetPointerStyles();
            ui.changeAddMenuStatus('')
        }

        // Add by text1
        let textModel = new ui.components.AddButtonModel({
            action: ui.states.editor.ADDING.ADD_CONTAINER,
            buttonImage: 'DefaultContainer',
            defaultButtonImage: 'DefaultContainer.svg',
            label: 'Add by text',
            name: '',
            statusText: 'Add multiple Actors by text: click on empty space in diagram to add multiple Actors',
            tooltip: 'Add by text'
        })
        textModel.act = function (e) {
            ui.prompt({
                title: 'Add by text:',
                className: 'mediumTextarea',
                value: 'Actor name1\nAgent name2\nRole name3',
                inputType: 'textarea',
                placeholder: 'Actor name1\nAgent name2\nRole name3',
                callback: function (value) {
                    if (!value) {
                        ui.clearElements();
                        return;
                    }
                    try {
                        value = value.trim()
                        let lines = value.split('\n')
                        _.forEach(lines, function (line) {
                            const type = getTypeName(line).type
                            const name = getTypeName(line).name
                            console.log(type, name)
                            elementsToAdd.push({type, name})
                            // addElement(type, name)
                        })
                        setAddState();
                    } catch (e) {
                        console.log(e)
                        ui.alert('INVALID: Sorry, but one of the actor you are trying to create is invalid');
                        ui.clearElements();
                    }
                }
            });
        }
        new ui.components.AddButtonDropdownItemView({
            attributes: {parent: '#add-actor-dropdown'}, model: textModel
        }).render();

        // Add by text (in batches)
        let textModel2 = new ui.components.AddButtonModel({
            action: ui.states.editor.ADDING.ADD_CONTAINER,
            buttonImage: 'DefaultContainer',
            defaultButtonImage: 'DefaultContainer.svg',
            label: 'Add by text (in batches)',
            name: '',
            statusText: 'Add multiple Actors by text: click on empty space in diagram to add multiple Actors',
            tooltip: 'Add by text (in batches)'
        })
        textModel2.act = function (e) {
            ui.prompt({
                title: 'Add by text:',
                className: 'mediumTextarea',
                value: 'Actor 3\nname1\nname2\nname3\n\nAgent 2\nname 1\nname 2\n\nRole 1\nname',
                inputType: 'textarea',
                placeholder: 'Actor 3\nname1\nname2\nname3\n\nAgent 2\nname 1\nname 2\n\nRole 1\nname',
                callback: function (value) {
                    if (!value) {
                        ui.clearElements();
                        return;
                    }
                    try {
                        value = value.trim()
                        let lines = value.split('\n')
                        let cur = 0
                        while (cur < lines.length) {
                            if (!lines[cur]) {
                                cur++
                                continue
                            }
                            let type = lines[cur].split(' ')[0]
                            let lineNum = parseInt(lines[cur].split(' ')[1]) || 1
                            for (let i = 0; i < lineNum; i++) {
                                cur++
                                // addElement(type, lines[cur])
                                elementsToAdd.push({type: type, name: lines[cur]})
                            }
                            cur++
                        }
                        setAddState('actor');
                    } catch (e) {
                        console.log(e)
                        ui.alert('INVALID: Sorry, but one of the actor you are trying to create is invalid');
                        ui.clearElements();
                    }
                }
            });
        }
        new ui.components.AddButtonDropdownItemView({
            attributes: {parent: '#add-actor-dropdown'}, model: textModel2
        }).render();

        // Add Actor by text
        let addActorByTextModel = new ui.components.AddButtonModel({
            action: ui.states.editor.ADDING.ADD_CONTAINER,
            buttonImage: 'Actor',
            defaultButtonImage: 'DefaultContainer.svg',
            label: 'Add Actor by text',
            name: '',
            statusText: 'Add multiple Actors by text: click on empty space in diagram to add multiple Actors',
            tooltip: 'Add Actor by text'
        })
        addActorByTextModel.act = function (e) {
            ui.prompt({
                title: 'Add Actor by text:',
                className: 'mediumTextarea',
                value: 'name1\nname2\nname3\n',
                inputType: 'textarea',
                placeholder: 'name1\nname2\nname3\n',
                callback: function (value) {
                    if (!value) {
                        ui.clearElements();
                        return
                    }
                    value = value.trim()
                    let lines = value.split('\n')
                    _.forEach(lines, function (line) {
                        // addElement('Actor', line)
                        elementsToAdd.push({type: 'Actor', name: line})
                    })
                    setAddState();
                }
            });
        }
        new ui.components.AddButtonDropdownItemView({
            attributes: {parent: '#add-actor-dropdown'}, model: addActorByTextModel
        }).render();

        // Add Agent by text
        let addAgentByTextModel = new ui.components.AddButtonModel({
            action: ui.states.editor.ADDING.ADD_CONTAINER,
            buttonImage: 'Agent',
            defaultButtonImage: 'DefaultContainer.svg',
            label: 'Add Agent by text',
            name: '',
            statusText: 'Add multiple Agents by text: click on empty space in diagram to add multiple Agents',
            tooltip: 'Add Agent by text'
        })
        addAgentByTextModel.act = function (e) {
            ui.prompt({
                title: 'Add Agent by text:',
                className: 'mediumTextarea',
                value: 'name1\nname2\nname3\n',
                inputType: 'textarea',
                placeholder: 'name1\nname2\nname3\n',
                callback: function (value) {
                    if (!value) {
                        ui.clearElements();
                        return
                    }
                    value = value.trim()
                    let lines = value.split('\n')
                    _.forEach(lines, function (line) {
                        elementsToAdd.push({type: 'Agent', name: line})
                    })
                    setAddState();
                }
            });
        }
        new ui.components.AddButtonDropdownItemView({
            attributes: {parent: '#add-actor-dropdown'}, model: addAgentByTextModel
        }).render();

        // Add Role by text
        let addRoleByTextModel = new ui.components.AddButtonModel({
            action: ui.states.editor.ADDING.ADD_CONTAINER,
            buttonImage: 'Role',
            defaultButtonImage: 'DefaultContainer.svg',
            label: 'Add Role by text',
            name: '',
            statusText: 'Add multiple Roles by text: click on empty space in diagram to add multiple Roles',
            tooltip: 'Add Role by text'
        })
        addRoleByTextModel.act = function (e) {
            ui.prompt({
                title: 'Add Role by text:',
                className: 'mediumTextarea',
                value: 'name1\nname2\nname3\n',
                inputType: 'textarea',
                placeholder: 'name1\nname2\nname3\n',
                callback: function (value) {
                    if (!value) {
                        ui.clearElements();
                        return
                    }
                    value = value.trim()
                    let lines = value.split('\n')
                    _.forEach(lines, function (line) {
                        elementsToAdd.push({type: 'Role', name: line})
                    })
                    setAddState()
                }
            });
        }
        new ui.components.AddButtonDropdownItemView({
            attributes: {parent: '#add-actor-dropdown'}, model: addRoleByTextModel
        }).render();
    } else {
        $('#menu-dropdown-actors').hide();
    }

    //create Add <<ContainerLink>> buttons
    if (istar.metamodel.containerLinks) {
        _.forEach(istar.metamodel.containerLinks, function (linkType) {
            //if specific ui elements are not defined, use default ones
            var label = linkType.buttonLabel || (linkType.name);
            var tooltip = linkType.buttonTooltip || ('Add a ' + linkType.name);
            var statusText = linkType.buttonStatusText || ('Adding a <b>' + linkType.name + '</b>');
            var image = linkType.name;

            new ui.components.AddButtonDropdownItemView({
                attributes: {parent: '#add-actor-link-dropdown'}, model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_LINK,
                    buttonImage: image,
                    defaultButtonImage: 'DefaultContainerLink.svg',
                    label: label,
                    name: linkType.name,
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        });
    } else {
        $('#menu-dropdown-actor-links').hide();
    }

    //create Add <<DependencyLink>> buttons
    var hasDependency = false;
    _.forEach(istar.metamodel.nodes, function (elementType) {
        if (elementType.canBeDependum) {
            hasDependency = true;

            //if specific ui elements are not defined, use default ones
            var label = elementType.buttonLabel || (elementType.name + ' dependency');
            var tooltip = elementType.buttonTooltip || ('Add a ' + elementType.name + ' Dependency link (including its dependum)');
            var statusText = elementType.buttonStatusText || ('Adding <b>' + elementType.name + ' Dependency</b> link');
            var image = elementType.name + 'DependencyLink';

            new ui.components.AddButtonDropdownItemView({
                attributes: {parent: '#add-dependency-dropdown'}, model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_LINK,
                    buttonImage: image,
                    defaultButtonImage: 'DefaultDependencyLink.svg',
                    label: label,
                    name: elementType.name + 'DependencyLink',
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        }
    });

    // Add Actor by given type, name and position
    function addElement(type, name, x, y) {
        try {
            name = name.trim()
            let r;
            switch (type) {
                case 'Actor':
                    r = istar.addActor(name, {position: {x: x, y: y}})
                    break
                case 'Agent':
                    r = istar.addAgent(name, {position: {x: x, y: y}})
                    break
                case 'Role':
                    r = istar.addRole(name, {position: {x: x, y: y}})
                    break
                default:
                    ui.alert('INVALID: Sorry, but one of the actor you are trying to create is invalid');
                    break
            }
            if (r) {
                istar.resizePaperBasedOnCell(r)
            }
            return r;
        } catch (e) {
            console.error(e)
            ui.alert('INVALID: Sorry, but one of the actor you are trying to create is invalid');
            ui.clearElements();
        }

    }

    // List all actors on canvas
    function listAllActors() {
        let allActors = []
        const Actors = new Set(['Agent', 'Role', 'Actor'])
        _.map(istar.getElements(), function (node) {
            if (Actors.has(node.prop('type'))) {
                allActors.push(node)
            }
        });
        return allActors
    }

    // Check Actor duplicate with name and type
    function isNodeDuplicate(actor1, actor2, type, name) {
        const Dependencies = new Set(['Goal', 'Quality', 'Resource', 'Task'])
        return new Promise((resolve, reject) => {
            _.map(istar.getElements(), function (node) {
                if (Dependencies.has(node.prop('type'))) {
                    if (node.prop('type') === type && node.prop('name') === name) {
                        const neighbours = istar.graph.getNeighbors(node);
                        // two-way duplicate
                        /*let neighboursID = []
                        for (let i = 0; i < neighbours.length; i++) {
                            neighboursID.push(neighbours[i].prop('id'))
                        }
                        if (neighboursID.includes(actor1.prop('id')) && neighboursID.includes(actor2.prop('id'))) {
                            resolve(true)
                        }*/
                        // one-way duplicate (may not stable)
                        if (neighbours[0] === actor2 && neighbours[1] === actor1) {
                            resolve(true)
                        }
                    }
                }
            })
            resolve(false)
        })
    }

    let type1, name1, type2, name2, lines, linenum
    let actor1, actor2

    // Select Actor by given type and name
    function getActorByNameType(type, name) {
        const allActors = listAllActors();
        let actors = [];
        _.forEach(allActors, function (actor) {
            if (name === actor.prop('name') && type === actor.prop('type')) {
                actors.push(actor)
            }
        });
        return actors;
    }

    // Add dependency by text
    function addDependencyByText(actor1, actor2) {
        let depx = 10, depy = 10;
        for (let i = 2; i < linenum; i++) {
            let dType = "", dName = "";
            // Goal, Task, Quality, Resource
            if (lines[i].indexOf(":") !== -1) {
                dType = lines[i].split(': ')[0]
                dName = lines[i].substring(lines[i].indexOf(': ') + 2)
            } else {
                dType = "ToBeRefined"
                dName = lines[i].trim()
            }
            // TODO: duplicate node detect
            isNodeDuplicate(actor1, actor2, dType, dName).then((isDuplicate) => {
                if (!isDuplicate) {
                    ui.addDependencyWithName(actor1, dType + 'DependencyLink', actor2, dName, depx, depy)
                } else {
                    ui.alert('INVALID: Sorry, the dependency link you are trying to add is duplicated.');
                }
            })

            depx += 100
            depy += 100
        }
        type1 = ""
        name1 = ""
        type2 = ""
        name2 = ""
        lines = []
        linenum = 0
    }

    // Add link by text
    ui.addLinkByText = function (x, y) {
        const actor1 = addElement(type1, name1, x, y);
        const actor2 = addElement(type2, name2, x + 250, y);
        addDependencyByText(actor1, actor2);
        ui.states.editor.transitionTo(ui.states.editor.VIEWING);
        ui.resetPointerStyles();
        ui.changeAddMenuStatus('')
    }

    // Add link by text with only one of the actors exist
    ui.addLinkByTextOneActor = function (idx, x, y) {
        switch (idx) {
            case 1:
                actor1 = addElement(type1, name1, x, y);
                actor2 = getActorByNameType(type2, name2)[0]
                break
            case 2:
                actor1 = getActorByNameType(type1, name1)[0]
                actor2 = addElement(type2, name2, x, y);
                break
        }
        addDependencyByText(actor1, actor2);
        ui.states.editor.transitionTo(ui.states.editor.VIEWING);
        ui.resetPointerStyles();
        ui.changeAddMenuStatus('')
    }

    function tryAddActors(type1, name1, type2, name2) {
        let actor1 = getActorByNameType(type1, name1), actor2 = getActorByNameType(type2, name2);
        const js1 = actor1.length
        const js2 = actor2.length
        actor1 = actor1[0]
        actor2 = actor2[0]
        if (js1 === 1 && js2 === 1) {
            addDependencyByText(actor1, actor2)
        } else if (js1 === 0 && js2 === 0) {
            ui.selectPaper();
            ui.states.editor.current = ui.states.editor.ADDING.ADD_LINK_BY_TEXT
            $('#diagram').css('cursor', 'crosshair');
            $('#diagram g').css('cursor', 'no-drop');
            $('#diagram .actorKindMain').css('cursor', 'no-drop');
        } else if (js1 === 1 && js2 === 0) {
            ui.selectPaper();
            ui.states.editor.current = ui.states.editor.ADDING.ADD_LINK_BY_TEXT_ACTOR_2
            $('#diagram').css('cursor', 'crosshair');
            $('#diagram g').css('cursor', 'no-drop');
            $('#diagram .actorKindMain').css('cursor', 'no-drop');
        } else if (js1 === 0 && js2 === 1) {
            ui.selectPaper();
            ui.states.editor.current = ui.states.editor.ADDING.ADD_LINK_BY_TEXT_ACTOR_1
            $('#diagram').css('cursor', 'crosshair');
            $('#diagram g').css('cursor', 'no-drop');
            $('#diagram .actorKindMain').css('cursor', 'no-drop');
        } else {
            ui.alert('Duplicate Actors.');
            // TODO: duplicate name
        }
    }

    ui.addDependencyByText = function (value) {
        if (!value) {
            ui.clearElements();
            return
        }
        value = value.trim();
        lines = value.split('\n');
        const line1 = lines[0].split(' depends on ');
        linenum = lines.length;
        type1 = line1[0].substring(0, line1[0].indexOf(' '));
        name1 = line1[0].substring(line1[0].indexOf(' ') + 1);
        type2 = line1[1].substring(0, line1[1].indexOf(' '));
        name2 = line1[1].substring(line1[1].indexOf(' ') + 1);
        if (type1 === type2 && name1 === name2) {
            ui.alert('INVALID: Sorry, the dependency link you are trying to add is invalid.');
        } else {
            tryAddActors(type1, name1, type2, name2);
        }
    }

    // Add dependency by text
    let addDependencyByTextModel = new ui.components.AddButtonModel({
        action: ui.states.editor.ADDING.ADD_LINK,
        buttonImage: 'DefaultDependencyLink',
        defaultButtonImage: 'DefaultDependencyLink.svg',
        label: 'Add Dependency by text',
        name: '',
        statusText: 'Add Dependency by text',
        tooltip: 'Add Dependency by text'
    })
    addDependencyByTextModel.act = function (e) {
        ui.prompt({
            title: 'Add Dependency by text:',
            className: 'mediumTextarea',
            value: '<type> A depends on <type> B\n' +
                'On:\n' +
                '<type>: <name>\n' +
                '...',
            inputType: 'textarea',
            placeholder: '<type> A depends on <type> B\n' +
                'On:\n' +
                '<type>: <name>\n' +
                '...',
            callback: ui.addDependencyByText
        });
    }
    new ui.components.AddButtonDropdownItemView({
        attributes: {parent: '#add-dependency-dropdown'},
        model: addDependencyByTextModel
    }).render();

    if (!hasDependency) {
        $('#menu-dropdown-dependency-links').hide();
    }


    //create Add <<Element>> buttons
    _.forEach(istar.metamodel.nodes, function (elementType) {
        if (elementType.canBeInnerElement || elementType.canBeOnPaper) {

            //if specific ui elements are not defined, use default ones
            var label = elementType.buttonLabel || elementType.name;
            var tooltip = elementType.buttonTooltip || ('Add ' + elementType.name);
            var statusText = elementType.buttonStatusText || ('Adding <b>' + elementType.name + '</b>');

            new ui.components.AddButtonView({
                model: new ui.components.AddButtonModel({
                    action: ui.states.editor.ADDING.ADD_NODE,
                    defaultButtonImage: 'DefaultNode.svg',
                    label: label,
                    name: elementType.name,
                    statusText: statusText,
                    tooltip: tooltip
                })
            }).render();
        }
    });

    //create Add <<NodeLink>> buttons
    _.forEach(istar.metamodel.nodeLinks, function (linkType) {
        if (linkType.canBeManuallyAdded !== false) {
            if (linkType.changeableLabel) {
                //create a dropdown button and then create a dropdown item for each possible value of the label

                //if specific ui elements are not defined, use default ones
                var label = (linkType.buttonLabel && linkType.buttonLabel[0]) || linkType.name;
                var tooltip = (linkType.buttonTooltip && linkType.buttonTooltip[0]) || ('Add ' + linkType.name);
                var image = linkType.name;

                new ui.components.AddButtonDropdownView({
                    model: new ui.components.AddButtonModel({
                        buttonImage: image,
                        defaultButtonImage: 'DefaultContainerLink.svg',
                        label: label,
                        name: linkType.name,
                        tooltip: tooltip
                    })
                }).render();

                //create the dropdown items
                _.forEach(linkType.possibleLabels, function (linkValue, i) {
                    //if specific ui elements are not defined, use default ones
                    var index = i + 1;
                    var label = linkValue
                    if (linkType.buttonLabel && linkType.buttonLabel[index]) {
                        label = linkType.buttonLabel[index];
                    }
                    var tooltip = ('Add a ' + linkValue + ' ' + linkType.name);
                    if (linkType.buttonTooltip && linkType.buttonTooltip[index]) {
                        tooltip = linkType.buttonTooltip[index];
                    }
                    var statusText = 'Adding a <b>' + linkValue + ' ' + linkType.name + '</b>';
                    if (linkType.buttonStatusText && linkType.buttonStatusText[index]) {
                        statusText = linkType.buttonStatusText[index];
                    }
                    var image = linkType.name + '-' + linkValue;
                    if (linkType.buttonImage && linkType.buttonImage[index]) {
                        image = linkType.buttonImage[index];
                    }

                    new ui.components.AddButtonDropdownItemView({
                        attributes: {parent: '#add-' + linkType.name + '-dropdown'},
                        model: new ui.components.AddButtonModel({
                            action: ui.states.editor.ADDING.ADD_LINK,
                            buttonImage: image,
                            defaultButtonImage: 'DefaultContainerLink.svg',
                            label: label,
                            name: linkType.name,
                            statusText: statusText,
                            tooltip: tooltip,
                            value: linkValue
                        })
                    }).render();
                });
            } else {
                //if specific ui elements are not defined, use default ones
                var label = linkType.buttonLabel || linkType.name;
                var tooltip = linkType.buttonTooltip || ('Add ' + linkType.name);
                var statusText = linkType.buttonStatusText || ('Adding <b>' + linkType.name + '</b>');
                var image = linkType.name;

                new ui.components.AddButtonView({
                    model: new ui.components.AddButtonModel({
                        action: ui.states.editor.ADDING.ADD_LINK,
                        buttonImage: image,
                        defaultButtonImage: 'DefaultContainerLink.svg',
                        label: label,
                        name: linkType.name,
                        statusText: statusText,
                        tooltip: tooltip
                    })
                }).render();
            }
        }
    });

    function addIntentions(cellView, x, y) {
        ui.states.editor.ADDING.data.button = {
            end: function () {
                'use strict';
                ui.states.editor.transitionTo(ui.states.editor.VIEWING);
            }
        }
        const initX = x
        let posX = x, posY = y
        const len = ui.states.editor.ADDING.data.intentionsToAdd.length
        _.forEach(ui.states.editor.ADDING.data.intentionsToAdd, function (i) {
            ui.states.editor.ADDING.data.typeNameToAdd = i.type
            ui.addElementOnContainer(cellView, {position: {x: posX, y: posY}, name: i.name});
            let col = Math.ceil(Math.sqrt(len))
            posX += 100
            if (posX > initX + (col - 1) * 100) {
                posX = initX
                posY += 60
            }
        })
        ui.states.editor.ADDING.data.typeNameToAdd = ''
        ui.states.editor.ADDING.data.intentionsToAdd = []
        ui.clearElements()
    }

    // Add by template
    ui.addIntentionByText = function (cellView, x, y) {
        if (cellView.model.prop('id') !== ui.states.editor.ADDING.data.intentionAddCellID) {
            ui.confirm({
                message: 'You selected a different Actor, do you really want to add intentions in to this actor? Click OK to continue, Cancel to re-select.',
                callback: function (result) {
                    if (result) {
                        addIntentions(cellView, x, y)
                    } else {
                        ui.selectPaper();
                        $('#diagram g').css('cursor', 'crosshair');
                        $('#diagram .actorKindMain').css('cursor', 'crosshair');
                        ui.states.editor.current = ui.states.editor.ADDING.ADD_INTENTION_BY_TEXT
                    }
                }
            })
        } else {
            addIntentions(cellView, x, y)
        }
    }

    ui.addRefinementLinkByText = function (type, target, x, y) {
        if (target.model.prop('id') === ui.states.editor.ADDING.data.intentionAddCellID) {
            const refinementTo = ui.states.editor.ADDING.data.addRefinementTo
            ui.states.editor.ADDING.data.button = {
                end: function () {
                    'use strict';
                    ui.states.editor.transitionTo(ui.states.editor.VIEWING);
                }
            }
            const initX = x
            let posX = x + 50, posY = y
            const len = ui.states.editor.ADDING.data.intentionsToAdd.length
            _.forEach(ui.states.editor.ADDING.data.intentionsToAdd, function (i) {
                ui.states.editor.ADDING.data.typeNameToAdd = i.type
                const source = ui.addElementOnContainer(target, {position: {x: posX, y: posY}, name: i.name});
                let linkType
                if (type === 'or') {
                    linkType = istar.metamodel.nodeLinks.OrRefinementLink
                } else if (type === 'and') {
                    linkType = istar.metamodel.nodeLinks.AndRefinementLink
                }
                istar.addLinkBetweenNodes(linkType, source, refinementTo)
                let col = Math.ceil(Math.sqrt(len))
                posX += 50
                if (posX > initX + (col - 1) * 50) {
                    posX = initX
                    posY += 60
                }
            })
            ui.states.editor.ADDING.data.typeNameToAdd = ''
            ui.states.editor.ADDING.data.intentionsToAdd = []
            ui.clearElements()
        } else {
            ui.alert("You selected a wrong position.")
        }
    }
}

/*definition of globals to prevent undue JSHint warnings*/
/*globals console:false, istar:false, _:false, ui:false, uiC:false, $:false */
