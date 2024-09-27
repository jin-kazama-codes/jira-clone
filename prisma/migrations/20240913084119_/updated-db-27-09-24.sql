--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-27 18:36:00

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 19735)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 860 (class 1247 OID 19774)
-- Name: Duration; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Duration" AS ENUM (
    'ONE_WEEK',
    'TWO_WEEKS',
    'THREE_WEEKS',
    'FOUR_WEEKS',
    'CUSTOM'
);


ALTER TYPE public."Duration" OWNER TO postgres;

--
-- TOC entry 854 (class 1247 OID 19758)
-- Name: IssueStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."IssueStatus" AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'DONE'
);


ALTER TYPE public."IssueStatus" OWNER TO postgres;

--
-- TOC entry 851 (class 1247 OID 19746)
-- Name: IssueType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."IssueType" AS ENUM (
    'BUG',
    'TASK',
    'SUBTASK',
    'STORY',
    'EPIC'
);


ALTER TYPE public."IssueType" OWNER TO postgres;

--
-- TOC entry 857 (class 1247 OID 19766)
-- Name: SprintStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SprintStatus" AS ENUM (
    'ACTIVE',
    'PENDING',
    'CLOSED'
);


ALTER TYPE public."SprintStatus" OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 19844)
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'admin',
    'manager',
    'member'
);


ALTER TYPE public.role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 19822)
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
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


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19831)
-- Name: DefaultUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DefaultUser" (
    name text NOT NULL,
    email text NOT NULL,
    avatar text,
    password text DEFAULT 'member@f2-fin'::text,
    role public.role DEFAULT 'member'::public.role,
    status boolean DEFAULT false NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."DefaultUser" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 20071)
-- Name: DefaultUser_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DefaultUser_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DefaultUser_id_seq" OWNER TO postgres;

--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 222
-- Name: DefaultUser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DefaultUser_id_seq" OWNED BY public."DefaultUser".id;


--
-- TOC entry 218 (class 1259 OID 19800)
-- Name: Issue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Issue" (
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


ALTER TABLE public."Issue" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 19793)
-- Name: Member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Member" (
    id integer NOT NULL,
    "projectId" integer NOT NULL
);


ALTER TABLE public."Member" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 19785)
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    key text NOT NULL,
    name text NOT NULL,
    "defaultAssignee" text,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    id integer NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 20084)
-- Name: Project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Project_id_seq" OWNER TO postgres;

--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 223
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;


--
-- TOC entry 219 (class 1259 OID 19813)
-- Name: Sprint; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sprint" (
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


ALTER TABLE public."Sprint" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 19736)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4690 (class 2604 OID 20072)
-- Name: DefaultUser id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DefaultUser" ALTER COLUMN id SET DEFAULT nextval('public."DefaultUser_id_seq"'::regclass);


--
-- TOC entry 4677 (class 2604 OID 20085)
-- Name: Project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);


--
-- TOC entry 4856 (class 0 OID 19822)
-- Dependencies: 220
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "createdAt", "updatedAt", "deletedAt", "isEdited", "issueId", "logId", "authorId") FROM stdin;
\.


--
-- TOC entry 4857 (class 0 OID 19831)
-- Dependencies: 221
-- Data for Name: DefaultUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DefaultUser" (name, email, avatar, password, role, status, id) FROM stdin;
Admin	atechno27@gmail.com	\N	admin@f2-fin	admin	f	1
Anas 	theanasiqball@gmail.com	\N	member@f2-fin	member	f	3
\.


--
-- TOC entry 4854 (class 0 OID 19800)
-- Dependencies: 218
-- Data for Name: Issue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Issue" (id, key, name, description, status, type, "sprintPosition", "boardPosition", "parentId", "sprintId", "isDeleted", "createdAt", "updatedAt", "deletedAt", "sprintColor", "reporterId", "assigneeId", "creatorId", "projectId") FROM stdin;
06faff95-1e57-4637-9c97-e1a9d5f89f61	ISSUE-1	this is new issue	\N	TODO	TASK	0	-1	\N	9134363c-eea6-4a83-9313-e7b3b0420639	f	2024-09-27 12:17:13.133	2024-09-27 12:20:26.365	\N	\N	1	\N	1	1
b12a203e-71f3-4881-b1ff-819748aee8af	ISSUE-3	issue three	\N	TODO	TASK	2	-1	\N	9134363c-eea6-4a83-9313-e7b3b0420639	f	2024-09-27 12:19:03.505	2024-09-27 12:28:01.338	\N	\N	1	\N	1	1
893ac208-37c0-4a46-b4a5-3043bef0da31	ISSUE-2	this is anpther issue 2	\N	IN_PROGRESS	TASK	1	-1	\N	9134363c-eea6-4a83-9313-e7b3b0420639	f	2024-09-27 12:17:46.043	2024-09-27 12:39:02.731	\N	\N	1	3	1	1
\.


--
-- TOC entry 4853 (class 0 OID 19793)
-- Dependencies: 217
-- Data for Name: Member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Member" (id, "projectId") FROM stdin;
1	1
3	1
\.


--
-- TOC entry 4852 (class 0 OID 19785)
-- Dependencies: 216
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (key, name, "defaultAssignee", "imageUrl", "createdAt", "updatedAt", "deletedAt", id) FROM stdin;
JIRA-CLONE	F2 - Fintech	1	\N	2024-09-27 16:05:54.878	\N	\N	1
\.


--
-- TOC entry 4855 (class 0 OID 19813)
-- Dependencies: 219
-- Data for Name: Sprint; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sprint" (id, name, description, duration, "startDate", "endDate", "createdAt", "updatedAt", "deletedAt", status, "projectId", "creatorId") FROM stdin;
9134363c-eea6-4a83-9313-e7b3b0420639	new sprint		1 week	2024-09-27 12:39:14.255	2024-10-04 12:39:14.255	2024-09-27 12:18:07.066	2024-09-27 12:39:24.301	\N	ACTIVE	1	1
\.


--
-- TOC entry 4851 (class 0 OID 19736)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
25c0837a-1224-48ee-9186-7cb6b03299b2	a60c2ac5b51616c734da2c45e80d1376fba68e0b80f37c3f6c646e0fd36f5007	2024-09-27 15:58:28.928478+05:30	20240913084119_	\N	\N	2024-09-27 15:58:28.873892+05:30	1
b35ddf5f-f081-4598-aeca-4a819f0394b1	806617663d9ce0d0eed0b30215e701aa1852300b8f44693f30733d07b4d0b782	2024-09-27 15:58:28.943203+05:30	20240926072135_change_user_role_to_string	\N	\N	2024-09-27 15:58:28.929265+05:30	1
ace73921-2538-4a3d-8793-9c5b92989391	563b79dde31c041aa22f410649e7a95a651bdb9392a8b9516d480c96cf21ab1d	2024-09-27 15:58:38.460383+05:30	20240927102838_migration_3	\N	\N	2024-09-27 15:58:38.417578+05:30	1
\.


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 222
-- Name: DefaultUser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DefaultUser_id_seq"', 3, true);


--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 223
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Project_id_seq"', 1, true);


--
-- TOC entry 4705 (class 2606 OID 19830)
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 20074)
-- Name: DefaultUser DefaultUser_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DefaultUser"
    ADD CONSTRAINT "DefaultUser_pkey" PRIMARY KEY (id);


--
-- TOC entry 4699 (class 2606 OID 19812)
-- Name: Issue Issue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Issue"
    ADD CONSTRAINT "Issue_pkey" PRIMARY KEY (id);


--
-- TOC entry 4697 (class 2606 OID 20083)
-- Name: Member Member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY (id);


--
-- TOC entry 4695 (class 2606 OID 20087)
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- TOC entry 4702 (class 2606 OID 19821)
-- Name: Sprint Sprint_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sprint"
    ADD CONSTRAINT "Sprint_pkey" PRIMARY KEY (id);


--
-- TOC entry 4692 (class 2606 OID 19744)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4703 (class 1259 OID 19842)
-- Name: Comment_issueId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Comment_issueId_idx" ON public."Comment" USING btree ("issueId");


--
-- TOC entry 4700 (class 1259 OID 19840)
-- Name: Issue_sprintId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Issue_sprintId_idx" ON public."Issue" USING btree ("sprintId");


--
-- TOC entry 4693 (class 1259 OID 19838)
-- Name: Project_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Project_key_key" ON public."Project" USING btree (key);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2024-09-27 18:36:00

--
-- PostgreSQL database dump complete
--

