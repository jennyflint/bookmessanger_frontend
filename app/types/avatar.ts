export interface AvatarItems {
    items: string[];
}

/** An avatar uploaded by the current user (POST /avatar/upload, GET /avatar/my) */
export interface UserBookAvatar {
    id: number;
    /** Public static URL, used as character.avatar like a stock avatar URL */
    url: string;
    original_name: string;
    content_type: string;
    size: number;
    created_at: string;
}

export interface UserBookAvatarList {
    items: UserBookAvatar[];
}

export interface DeleteAvatarResponse {
    message: string;
    success: boolean;
}
