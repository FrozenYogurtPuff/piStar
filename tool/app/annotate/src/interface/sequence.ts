export class LabelItem {
    constructor(
        readonly id: number,
        readonly text: string,
        readonly prefixKey: string | null,
        readonly suffixKey: string | null,
        readonly backgroundColor: string,
        readonly textColor: string = '#ffffff'
    ) {}

    static create(
        text: string,
        prefixKey: string | null,
        suffixKey: string | null,
        backgroundColor: string
    ): LabelItem {
        return new LabelItem(0, text, prefixKey, suffixKey, backgroundColor)
    }
}

export class LabelDTO {
    id: number
    text: string
    prefixKey: string | null
    suffixKey: string | null
    backgroundColor: string
    textColor: string

    constructor(item: LabelItem) {
        this.id = item.id
        this.text = item.text
        this.prefixKey = item.prefixKey
        this.suffixKey = item.suffixKey
        this.backgroundColor = item.backgroundColor
        this.textColor = '#ffffff'
    }
}

export class Span {
    constructor(
        readonly id: number,
        private _label: number,
        readonly user: number,
        readonly startOffset: number,
        readonly endOffset: number
    ) {}

    get label(): number {
        return this._label
    }

    changeLabel(label: number) {
        this._label = label
    }
}

export class SpanDTO {
    id: number
    label: number
    user: number
    startOffset: number
    endOffset: number

    constructor(item: Span) {
        this.id = item.id
        this.label = item.label
        this.user = item.user
        this.startOffset = item.startOffset
        this.endOffset = item.endOffset
    }
}
