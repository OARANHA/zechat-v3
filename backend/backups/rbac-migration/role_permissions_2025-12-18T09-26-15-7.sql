--
-- PostgreSQL database dump
--

\restrict 6G2a7KDnv3RyI3AG1NMGa8FZ6FUpcpzvD5D9i6kfROcsz11N1cSQ40H5oPZ0vXh

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
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public.role_permissions (
    id integer NOT NULL,
    "roleId" integer NOT NULL,
    "permissionId" integer NOT NULL,
    "tenantId" integer NOT NULL,
    "assignedBy" integer,
    "grantedAt" timestamp with time zone,
    "expiresAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO chatex;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public.role_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_permissions_id_seq OWNER TO chatex;

--
-- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.role_permissions (id, "roleId", "permissionId", "tenantId", "assignedBy", "grantedAt", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 1, false);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 6G2a7KDnv3RyI3AG1NMGa8FZ6FUpcpzvD5D9i6kfROcsz11N1cSQ40H5oPZ0vXh

