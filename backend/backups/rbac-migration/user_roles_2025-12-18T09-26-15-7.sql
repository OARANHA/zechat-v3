--
-- PostgreSQL database dump
--

\restrict IGD1lWMbIKuYeOm90OwDCd0DNv0iX5hsaNUtLYzwGnoK283IZB8NZkbKiNiEsOu

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
-- Name: user_roles; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "roleId" integer NOT NULL,
    "tenantId" integer NOT NULL,
    "assignedBy" integer,
    "expiresAt" timestamp with time zone,
    "isDefault" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.user_roles OWNER TO chatex;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO chatex;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.user_roles (id, "userId", "roleId", "tenantId", "assignedBy", "expiresAt", "isDefault", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, false);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict IGD1lWMbIKuYeOm90OwDCd0DNv0iX5hsaNUtLYzwGnoK283IZB8NZkbKiNiEsOu

