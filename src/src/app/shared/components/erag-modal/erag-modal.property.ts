export class ModalProperty {
    public title: string;
    public header: string;
    public body: string;
    public footer: string;
    public textarea: boolean;
    public textareaLabel: string;
    public comments = '';
    constructor(title: string, header: string, body: string, footer?: string, textarea?: boolean, textareaLabel?: string) {
        this.title = title;
        this.header = header;
        this.body = body;
        this.footer = footer;
        this.textarea = textarea;
        this.textareaLabel = textareaLabel;
    }
}
