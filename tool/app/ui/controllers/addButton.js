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

        function addElement(type, name) {
            name = name.trim()
            switch (type) {
                case 'Actor':
                    istar.addActor(name, {position: {x: positionX, y: positionY}})
                    nextPosition()
                    break
                case 'Agent':
                    istar.addAgent(name, {position: {x: positionX, y: positionY}})
                    nextPosition()
                    break
                case 'Role':
                    istar.addRole(name, {position: {x: positionX, y: positionY}})
                    nextPosition()
                    break
                default:
                    ui.alert('INVALID: Sorry, but one of the actor you are trying to create is invalid');
            }
        }

        let elementsToAdd = []

        ui.addElements = function addElements() {
            _.forEach(elementsToAdd, function (element) {
                addElement(element.type, element.name)
            })
        }

        ui.clearElements = function () {
            elementsToAdd = []
            ui.states.editor.transitionTo(ui.states.editor.VIEWING);
            ui.resetPointerStyles();
            ui.changeAddMenuStatus('')
        }

        let textModel = new ui.components.AddButtonModel({
            action: ui.states.editor.ADDING.ADD_CONTAINER,
            buttonImage: null,
            defaultButtonImage: null,
            label: 'Add by text',
            name: '',
            statusText: 'Add multiple Actors by text: click on empty space in diagram to add multiple Actors',
            tooltip: 'Add by text'
        })
        textModel.act = function (e) {
            ui.prompt({
                title: 'Add by text:',
                value: '',
                inputType: 'textarea',
                placeholder: 'Actor name1\nAgent name2\nRole name3',
                callback: function (value) {
                    if (!value) {
                        ui.clearElements();
                        return;
                    }
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
                }
            });
        }
        new ui.components.AddButtonDropdownItemView({
            attributes: {parent: '#add-actor-dropdown'}, model: textModel
        }).render();

        let textModel2 = new ui.components.AddButtonModel({
            action: ui.states.editor.ADDING.ADD_CONTAINER,
            buttonImage: null,
            defaultButtonImage: null,
            label: 'Add by text2',
            name: '',
            statusText: 'Add multiple Actors by text: click on empty space in diagram to add multiple Actors',
            tooltip: 'Add by text2'
        })
        textModel2.act = function (e) {
            ui.prompt({
                title: 'Add by text:',
                value: '',
                inputType: 'textarea',
                placeholder: 'Actor 3\nname1\nname2\nname3\n\nAgent 2\nname 1\nname 2\n\nRole 1\nname',
                callback: function (value) {
                    if (!value) {
                        ui.clearElements();
                        return;
                    }
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
                    setAddState();
                }
            });
        }
        new ui.components.AddButtonDropdownItemView({
            attributes: {parent: '#add-actor-dropdown'}, model: textModel2
        }).render();

        $("#d-add-by-text").click(function () {
            textModel.act()
        })

        $("#d-add-by-text2").click(function () {
            textModel2.act()
        })

        $("#d-add-actor-by-text").click(function () {
            ui.prompt({
                title: 'Add by text:',
                value: '',
                inputType: 'textarea',
                placeholder: 'name1\nname2\nname3\n',
                callback: function (value) {
                    if (!value) return
                    value = value.trim()
                    let lines = value.split('\n')
                    _.forEach(lines, function (line) {
                        // addElement('Actor', line)
                        elementsToAdd.push({type: 'Actor', name: line})
                    })
                    setAddState();
                }
            });
        })

        $("#d-add-agent-by-text").click(function () {
            ui.prompt({
                title: 'Add by text:',
                value: '',
                inputType: 'textarea',
                placeholder: 'name1\nname2\nname3\n',
                callback: function (value) {
                    if (!value) return
                    value = value.trim()
                    let lines = value.split('\n')
                    _.forEach(lines, function (line) {
                        elementsToAdd.push({type: 'Agent', name: line})
                    })
                    setAddState();
                }
            });
        })

        $("#d-add-role-by-text").click(function () {
            ui.prompt({
                title: 'Add by text:',
                value: '',
                inputType: 'textarea',
                placeholder: 'name1\nname2\nname3\n',
                callback: function (value) {
                    if (!value) return
                    value = value.trim()
                    let lines = value.split('\n')
                    _.forEach(lines, function (line) {
                        elementsToAdd.push({type: 'Role', name: line})
                    })
                    setAddState()
                }
            });
        })
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

}

/*definition of globals to prevent undue JSHint warnings*/
/*globals console:false, istar:false, _:false, ui:false, uiC:false, $:false */
