import {IResourceItem} from './common';

export type IContentType = 'text' | 'picture' | 'video' | 'audio';

export interface IRendition {
    href: string;
    mimetype: string;
    media?: string;
    width?: number;
    height?: number;
}

export interface IArticle extends IResourceItem {
    guid: string;
    type: IContentType;
    ancestors?: Array<IArticle['_id']>;
    nextversion?: IArticle['_id'];
    associations?: {[key: string]: IArticle};
    renditions?: {[key: string]: IRendition};
    slugline: string;
    headline: string;
    anpa_take_key?: string;
    source: string;
    versioncreated: string;
    version?: number | string;
    extra?: {
        type?: 'transcript';
        [key: string]: any;
    };
    es_highlight?: {[field: string]: Array<string>}
    deleted?: boolean; // Used only in the front-end, populated by wire/reducer
}
