use diesel::prelude::*;

table! {
    users (id) {
        id -> Int4,
        email -> Text,
        username -> Text,
        inkbucks -> Int4,
    }
}

table! {
    icons (id) {
        id -> Int4,
        user_id -> Int4,
        icon_pack_id -> Nullable<Int4>,
        metadata -> Nullable<Text>,
        image_data -> Bytea,
    }
}

table! {
    transactions (id) {
        id -> Int4,
        user_id -> Int4,
        type_ -> Text,
        icon_id -> Int4,
        amount -> Int4,
    }
}

joinable!(icons -> users (user_id));
joinable!(transactions -> users (user_id));
joinable!(transactions -> icons (icon_id));

allow_tables_to_appear_in_same_query!(users, icons, transactions);
