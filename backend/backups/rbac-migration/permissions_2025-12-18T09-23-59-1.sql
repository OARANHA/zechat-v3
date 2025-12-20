--
-- PostgreSQL database dump
--

\restrict EFYYkZ1sVB1hNzZiCiWGb1300L5RJS85eW8pmXfVhovsLPN2LFfpaqgGxy0rldT

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

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
-- Name: permissions; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    module character varying(255),
    action character varying(255),
    resource character varying(255),
    "isSystem" boolean DEFAULT false,
    "tenantId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.permissions OWNER TO chatex;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO chatex;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.permissions (id, name, description, module, action, resource, "isSystem", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "permissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict EFYYkZ1sVB1hNzZiCiWGb1300L5RJS85eW8pmXfVhovsLPN2LFfpaqgGxy0rldT

