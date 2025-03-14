# PROMPT d4522a64-a377-41cd-873b-b7f192ab2702


I want to create an icon generation website. I wanna use supabase as my backend.

The website will use inkbucks as a currency used to control user usage.
Each generation of an icon is 1 inkbuck, each styling is one inkbuck, each edit is one inkbuck too.

Icons come in packs, a user is able to add icons to that pack and have them look similar.

I want you to help structure my database so that i can track the users inkbuck usage as well as store the
icons they create, style, and edit inside supabase. How can I do this? I would like to be able to 
store the icons inside the database as well as keep track of the packs used by the users.


# OUTPUT d4522a64-a377-41cd-873b-b7f192ab2702
To structure your database efficiently in Supabase, you'll need tables to store user data, track Inkbucks usage, organize icons into packs, and keep records of generated icons. Below is a proposed structure:

---

### **Tables & Relationships**

#### **`users`** (Stores user information)
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `username` (Text, Unique)
- `inkbucks` (Integer, Default: 0)
- `created_at` (Timestamp)

#### **`icon_packs`** (Stores icon packs)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id` ON DELETE CASCADE)
- `name` (Text)
- `created_at` (Timestamp)

#### **`icons`** (Stores generated icons)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id` ON DELETE CASCADE)
- `icon_pack_id` (UUID, Foreign Key → `icon_packs.id` ON DELETE SET NULL)
- `image_url` (Text) **(Path to Supabase Storage)**
- `metadata` (JSONB) **(Store additional icon data – styling, size, format, etc.)**
- `created_at` (Timestamp)

#### **`transactions`** (Tracks Inkbuck usage)
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id` ON DELETE CASCADE)
- `type` (Text, Enum: `'generate' | 'style' | 'edit'`)
- `icon_id` (UUID, Foreign Key → `icons.id` ON DELETE CASCADE)
- `amount` (Integer, Negative for spending Inkbucks)
- `created_at` (Timestamp)

---

### **Additional Considerations**
1. **Storage**
   - Store the actual icons in **Supabase Storage** (e.g., `/icons/{user_id}/{icon_id}.png`) and save the reference (`image_url`) in the `icons` table.
   
2. **Inkbuck Usage Logic**
   - Deduct 1 Inkbuck per action (generation, styling, editing) and create an entry in `transactions` table.
   - Ensure **database triggers** or Supabase **Row-Level Security (RLS)** rules enforce that users never have a negative balance.

3. **Fetching User Data Efficiently**
   - Example query to fetch user icon packs with icons:
     ```sql
     SELECT ip.id, ip.name, 
            json_agg(i.*) AS icons
     FROM icon_packs ip
     LEFT JOIN icons i ON ip.id = i.icon_pack_id
     WHERE ip.user_id = 'user-id-here'
     GROUP BY ip.id;
     ```

This setup ensures:
- **Scalability:** JSONB columns can store flexible metadata.
- **Tracking & Auditing:** Transactions ensure inkbuck deductions are recorded.
- **Relational Integrity:** Icons belong to packs, and packs belong to users.

Would you like any changes to fit your specific needs? 🚀

# ASK MODEL BELLOW
