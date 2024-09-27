PGDMP                      |            jira    16.4    16.4 ,    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    17931    jira    DATABASE     w   CREATE DATABASE jira WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE jira;
                postgres    false                        2615    19735    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false                       0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5                       0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5            \           1247    19774    Duration    TYPE     ~   CREATE TYPE public."Duration" AS ENUM (
    'ONE_WEEK',
    'TWO_WEEKS',
    'THREE_WEEKS',
    'FOUR_WEEKS',
    'CUSTOM'
);
    DROP TYPE public."Duration";
       public          postgres    false    5            V           1247    19758    IssueStatus    TYPE     X   CREATE TYPE public."IssueStatus" AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE'
);
     DROP TYPE public."IssueStatus";
       public          postgres    false    5            S           1247    19746 	   IssueType    TYPE     j   CREATE TYPE public."IssueType" AS ENUM (
    'BUG',
    'TASK',
    'SUBTASK',
    'STORY',
    'EPIC'
);
    DROP TYPE public."IssueType";
       public          postgres    false    5            Y           1247    19766    SprintStatus    TYPE     Y   CREATE TYPE public."SprintStatus" AS ENUM (
    'ACTIVE',
    'PENDING',
    'CLOSED'
);
 !   DROP TYPE public."SprintStatus";
       public          postgres    false    5            q           1247    19844    role    TYPE     N   CREATE TYPE public.role AS ENUM (
    'admin',
    'manager',
    'member'
);
    DROP TYPE public.role;
       public          postgres    false    5            �            1259    19822    Comment    TABLE     �  CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "isEdited" boolean DEFAULT false NOT NULL,
    "issueId" text NOT NULL,
    "logId" text,
    "authorId" integer
);
    DROP TABLE public."Comment";
       public         heap    postgres    false    5            �            1259    19831    DefaultUser    TABLE       CREATE TABLE public."DefaultUser" (
    name text NOT NULL,
    email text NOT NULL,
    avatar text,
    password text DEFAULT 'member@f2-fin'::text,
    role public.role DEFAULT 'member'::public.role,
    status boolean DEFAULT false NOT NULL,
    id integer NOT NULL
);
 !   DROP TABLE public."DefaultUser";
       public         heap    postgres    false    881    5    881            �            1259    20071    DefaultUser_id_seq    SEQUENCE     �   CREATE SEQUENCE public."DefaultUser_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."DefaultUser_id_seq";
       public          postgres    false    5    221                       0    0    DefaultUser_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."DefaultUser_id_seq" OWNED BY public."DefaultUser".id;
          public          postgres    false    222            �            1259    19800    Issue    TABLE       CREATE TABLE public."Issue" (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    description text,
    status public."IssueStatus" DEFAULT 'TODO'::public."IssueStatus" NOT NULL,
    type public."IssueType" DEFAULT 'TASK'::public."IssueType" NOT NULL,
    "sprintPosition" double precision NOT NULL,
    "boardPosition" double precision DEFAULT '-1'::integer NOT NULL,
    "parentId" text,
    "sprintId" text,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "sprintColor" text,
    "reporterId" integer,
    "assigneeId" integer,
    "creatorId" integer,
    "projectId" integer
);
    DROP TABLE public."Issue";
       public         heap    postgres    false    854    851    851    5    854            �            1259    19793    Member    TABLE     \   CREATE TABLE public."Member" (
    id integer NOT NULL,
    "projectId" integer NOT NULL
);
    DROP TABLE public."Member";
       public         heap    postgres    false    5            �            1259    19785    Project    TABLE     N  CREATE TABLE public."Project" (
    key text NOT NULL,
    name text NOT NULL,
    "defaultAssignee" text,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    id integer NOT NULL
);
    DROP TABLE public."Project";
       public         heap    postgres    false    5            �            1259    20084    Project_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Project_id_seq";
       public          postgres    false    216    5                       0    0    Project_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;
          public          postgres    false    223            �            1259    19813    Sprint    TABLE       CREATE TABLE public."Sprint" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    duration text,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    status public."SprintStatus" DEFAULT 'PENDING'::public."SprintStatus" NOT NULL,
    "projectId" integer,
    "creatorId" integer
);
    DROP TABLE public."Sprint";
       public         heap    postgres    false    857    857    5            �            1259    19736    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5            R           2604    20072    DefaultUser id    DEFAULT     t   ALTER TABLE ONLY public."DefaultUser" ALTER COLUMN id SET DEFAULT nextval('public."DefaultUser_id_seq"'::regclass);
 ?   ALTER TABLE public."DefaultUser" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221            E           2604    20085 
   Project id    DEFAULT     l   ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);
 ;   ALTER TABLE public."Project" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    216            �          0    19822    Comment 
   TABLE DATA           �   COPY public."Comment" (id, content, "createdAt", "updatedAt", "deletedAt", "isEdited", "issueId", "logId", "authorId") FROM stdin;
    public          postgres    false    220   66       �          0    19831    DefaultUser 
   TABLE DATA           X   COPY public."DefaultUser" (name, email, avatar, password, role, status, id) FROM stdin;
    public          postgres    false    221   S6       �          0    19800    Issue 
   TABLE DATA           �   COPY public."Issue" (id, key, name, description, status, type, "sprintPosition", "boardPosition", "parentId", "sprintId", "isDeleted", "createdAt", "updatedAt", "deletedAt", "sprintColor", "reporterId", "assigneeId", "creatorId", "projectId") FROM stdin;
    public          postgres    false    218   �6       �          0    19793    Member 
   TABLE DATA           3   COPY public."Member" (id, "projectId") FROM stdin;
    public          postgres    false    217   �7       �          0    19785    Project 
   TABLE DATA           x   COPY public."Project" (key, name, "defaultAssignee", "imageUrl", "createdAt", "updatedAt", "deletedAt", id) FROM stdin;
    public          postgres    false    216   8       �          0    19813    Sprint 
   TABLE DATA           �   COPY public."Sprint" (id, name, description, duration, "startDate", "endDate", "createdAt", "updatedAt", "deletedAt", status, "projectId", "creatorId") FROM stdin;
    public          postgres    false    219   ]8       �          0    19736    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    215   �8                  0    0    DefaultUser_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."DefaultUser_id_seq"', 3, true);
          public          postgres    false    222                       0    0    Project_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Project_id_seq"', 1, true);
          public          postgres    false    223            a           2606    19830    Comment Comment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Comment" DROP CONSTRAINT "Comment_pkey";
       public            postgres    false    220            c           2606    20074    DefaultUser DefaultUser_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."DefaultUser"
    ADD CONSTRAINT "DefaultUser_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."DefaultUser" DROP CONSTRAINT "DefaultUser_pkey";
       public            postgres    false    221            [           2606    19812    Issue Issue_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Issue"
    ADD CONSTRAINT "Issue_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Issue" DROP CONSTRAINT "Issue_pkey";
       public            postgres    false    218            Y           2606    20083    Member Member_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Member" DROP CONSTRAINT "Member_pkey";
       public            postgres    false    217            W           2606    20087    Project Project_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Project" DROP CONSTRAINT "Project_pkey";
       public            postgres    false    216            ^           2606    19821    Sprint Sprint_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Sprint"
    ADD CONSTRAINT "Sprint_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Sprint" DROP CONSTRAINT "Sprint_pkey";
       public            postgres    false    219            T           2606    19744 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    215            _           1259    19842    Comment_issueId_idx    INDEX     P   CREATE INDEX "Comment_issueId_idx" ON public."Comment" USING btree ("issueId");
 )   DROP INDEX public."Comment_issueId_idx";
       public            postgres    false    220            \           1259    19840    Issue_sprintId_idx    INDEX     N   CREATE INDEX "Issue_sprintId_idx" ON public."Issue" USING btree ("sprintId");
 (   DROP INDEX public."Issue_sprintId_idx";
       public            postgres    false    218            U           1259    19838    Project_key_key    INDEX     M   CREATE UNIQUE INDEX "Project_key_key" ON public."Project" USING btree (key);
 %   DROP INDEX public."Project_key_key";
       public            postgres    false    216            �      x������ � �      �   [   x�sL����L,IM���72wH�M���K�����LI:�馁ԀU�qr9�%+p�d�&��I�99��rSs�R�`!<�Nc�=... �1$�      �     x����jAE�=_1?PM=�9�@$H@�cvB��1	j��u��*�U�^t%�-P��q�2���%��H-��}�.��s[��8g�[���y��O��BUw�I�8!���� ��d@��$��� F`�w�;M"3��c�����Z45j��(<�@�@��MH9�T��E�h���g��s�P�E;g�	s�%��ďX��I���>��|O;�.�|�o�zk��x۬_6���lЃ��+�L�j���ې���n��rĄ8      �      x�3�4�2�=... ��      �   F   x���r�u���s�t3R�Up��+IM��4���4202�5��52W04�20�25ѳ0� I�!W� �N      �      x�m�=
�@@�z�{�Y�/���$X�X�U�D�!r}�����WYM���}�hS�X���:�	e���_��8n�C�(%�4��-I��΄d��sߨ$���#���3���zc
!| :�$�      �   O  x�}�Yj[AE��V��Т��I��
�A"�,�?�`N�@}����%i�l%!QN��H���Z�
L�E�QiR��^�e�t֢>�:L��S�f0;� ;�p�D��$~"?y6�
rb�@ �g��O�^�77���7�*K�Sf������2ZI�8��\�ࠊ��=ڀct��2�t!�������;X͋3���g&��I�Y���\�cy��~�1��m~�/��̂V����6��0��/��-8��a�x�j��`l��
���cX	)*X{](����١��IX*������f�@ξ�����q�]w���k��o���q۶_MY�     