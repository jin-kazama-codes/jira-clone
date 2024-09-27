--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-27 18:34:35

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
-- TOC entry 4816 (class 1262 OID 17931)
-- Name: jira; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE jira WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';


ALTER DATABASE jira OWNER TO postgres;

\connect jira

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
-- TOC entry 4810 (class 0 OID 19822)
-- Dependencies: 220
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "createdAt", "updatedAt", "deletedAt", "isEdited", "issueId", "logId", "authorId") FROM stdin;
\.


--
-- TOC entry 4666 (class 2606 OID 19830)
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- TOC entry 4664 (class 1259 OID 19842)
-- Name: Comment_issueId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Comment_issueId_idx" ON public."Comment" USING btree ("issueId");


-- Completed on 2024-09-27 18:34:36

--
-- PostgreSQL database dump complete
--

