import { FileLikeObject } from 'ng2-file-upload/file-upload/file-like-object.class';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectionStrategy, Directive } from '@angular/core';

@Component({
    selector: 'erag-file-upload',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['erag-file-upload.component.scss'],
    template: `
        <ng-container *ngIf="show">
            <button (click)="fileUpload.click()" class="btn file-cust file-btn" type="button">
                <i class="fa fa-folder-open-o" aria-hidden="true"></i>{{btnLabel}}
            </button>
            <input id="fileUpload" hidden type="file" class="form-control" name="file"
                     accept="{{fileType}}"
                     #fileUpload
                     (change)="onInputChange($event)"
                     [uploader]="uploader"
                     ng2FileSelect/>
        </ng-container>
    `
})
export class EragFileLoaderComponent implements OnInit, AfterContentInit, OnChanges {
    fileUploadOption: FileUploaderOptions = {
        queueLimit: 1,
        removeAfterUpload: true,
        headers: []
          // default , set mutil = true to allow multiple upload
    };
    public uploader: FileUploader;

    @Input() show = true;

    @Input() userInfo: {id: string, name: string};

    @Input() fileType: string;
    @Input() btnLabel = 'Browse';

    @Input() maxSize: string;

    @Input() api: string;

    @Input() multi: boolean;

    @Input() autoUpload: boolean;

    @Input() authToken: string;

    @Input() fileRef: string;

    @Input() extra: string;

    @Input() executeUploadFile = false;

    @Input() deleteFiles: string | string[];

    @Output() uploadSuccess = new EventEmitter<any>();
    @Output() uploadFailure = new EventEmitter<any>();
    @Output() addFile = new EventEmitter<FileItem>();
    @Output() addInvalidFile = new EventEmitter<FileItem>();
    // @Output() invalidMaxSize = new EventEmitter<any>();

    ngOnInit() {
        this.uploader = new FileUploader(this.fileUploadOption);
    }
    ngAfterContentInit() {
        // this.fileUploadOption.queueLimit 1,

        this.registerEventListeners();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.maxSize && changes.maxSize.currentValue) {
            this.fileUploadOption.maxFileSize = this.convertSize(changes.maxSize.currentValue);
        }
        if (changes.api && changes.api.currentValue) {
            this.fileUploadOption.url = changes.api.currentValue;
        }
        if (changes.multi && !changes.multi.firstChange && changes.multi.currentValue) {
            this.fileUploadOption.queueLimit = undefined;
        }
        // if (changes.autoUpload && !!changes.autoUpload.currentValue) {
        //     setTimeout(() => this.fileUploadOption.autoUpload = true, 10);
        //   //  this.fileUploadOption.autoUpload = true;
        //     // this.ajaxUpload();
        // }
        if (changes.authToken && changes.authToken.currentValue) {
            const header = {
                name: 'Authorization',
                value: 'Bearer ' + changes.authToken.currentValue
            };

            this.updateHeaders(header);
        }

        if (changes.userInfo && changes.userInfo.currentValue) {
            const headerId = {
                name: 'id',
                value: changes.userInfo.currentValue.id
            };

            const headerName = {
                name: 'name',
                value: changes.userInfo.currentValue.name
            };

            this.updateHeaders(headerId);
            this.updateHeaders(headerName);

          // console.log('this.fileUploadOption.headers: ', this.fileUploadOption.headers);
        }
        if (changes.fileRef && changes.fileRef.currentValue) {
            const header = {
                name: 'category',
                value: changes.fileRef.currentValue
            };

            this.updateHeaders(header);
        }

        if (changes.extra && changes.extra.currentValue) {
            const header = {
                name: 'extraparam',
                value: changes.extra.currentValue
            };

            this.updateHeaders(header);
        }

        if (changes.executeUploadFile && changes.executeUploadFile.currentValue && !changes.executeUploadFile.firstChange) {
            if (this.uploader.queue.length && !this.autoUpload) {
                this.ajaxUpload();
            }
        }

        if (changes.deleteFiles && changes.deleteFiles.currentValue) {
            if (typeof changes.deleteFiles.currentValue === 'string') {

                this.deleteFileFromQueue(changes.deleteFiles.currentValue);
            } else {
                changes.deleteFiles.currentValue.forEach(this.deleteFileFromQueue);
            }
        }
    }

    updateHeaders(header: { name: string, value: string }) {
        const newHeaders = this.fileUploadOption.headers.filter(item => {
            return item.name !== header.name;
        });

        newHeaders.push(header);

        this.emptyArray(this.fileUploadOption.headers);
        Object.assign(this.fileUploadOption.headers, newHeaders);
    }

    emptyArray(arr) {
        while (arr.length) {
            arr.pop();
        }
    }
    registerEventListeners() {
        // this.uploader.onBuildItemForm = (file: FileItem, form: any) => {
        //     if (this.userInfo) {
        //         form.append('id', this.userInfo.id);
        //         form.append('name', this.userInfo.name);
        //     }
        // };


        this.uploader.onAfterAddingFile = (item: FileItem) => {
            item.withCredentials = false;
            const exts = item.file.name.split('.');
            const fileExt = '.' + exts[exts.length - 1];
            if (!!this.fileType) {
                if (this.fileType === '.cer' && fileExt === '.crt') { // special for crt file only
                    console.log('right here adding file');
                    this.addFile.emit(item);
                } else {
                    if (fileExt.toLowerCase() === this.fileType.toLowerCase()) {
                        this.addFile.emit(item);
                    } else {
                        this.deleteFileFromQueue(item.file.name);
                        this.addInvalidFile.emit(item);
                    }
                }
            } else {
                this.addFile.emit(item);
            }

        };

        this.uploader.onWhenAddingFileFailed = (item: FileLikeObject, filter: any, options: any) => {
            console.log('onWhenAddingFileFailed: ', this.uploader.queue.length);
        };

        this.uploader.onSuccessItem = (file: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            this.uploadSuccess.emit({ file, response });
        };

        this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            this.uploadFailure.emit(item);
            this.deleteFileFromQueue(item._file.name);
           // console.log('failure: ', this.uploader.queue.length);
        };
    }

    onInputChange($event) {
        if ($event.target.files.length) {
            if (this.autoUpload) {
                this.ajaxUpload();
            }
        }
        $event.target.value = '';
    }

    ajaxUpload() {
        if (this.uploader) {
            this.uploader.uploadAll();
        }

    }

    convertSize(size: string): number {
        if (!!Number(size)) {
            return Number(size);
        }

        const post = size.substr(size.length - 2);
        const pre = size.substr(0, size.length - 2);
        if (post.toUpperCase() === 'MB') {
            return 1024 * 1024 * Number(pre);
        } else if (post.toUpperCase() === 'KB') {
            return 1024 * Number(pre);
        }
    }

    deleteFileFromQueue(fileName: string) {
        if (this.uploader.queue.length) {
            this.uploader.queue.some((fileItem: FileItem) => {
                if (fileItem.file.name === fileName) {
                    this.uploader.removeFromQueue(fileItem);
                    return true;
                }
            });
            // this.uploader.clearQueue();
        }
    }
}
