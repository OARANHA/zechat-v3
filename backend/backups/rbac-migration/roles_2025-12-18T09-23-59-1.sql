--
-- PostgreSQL database dump
--

\restrict KeZMc465e6LlHVLBIEAp4nAY8gKejthULJMtW1k7oDHbZo9a5vUcgPLJyrNZeas

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
-- Name: roles; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    level integer DEFAULT 0,
    "isSystem" boolean DEFAULT false,
    "tenantId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO chatex;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO chatex;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.roles (id, name, description, level, "isSystem", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict KeZMc465e6LlHVLBIEAp4nAY8gKejthULJMtW1k7oDHbZo9a5vUcgPLJyrNZeas

