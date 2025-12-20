--
-- PostgreSQL database dump
--

\restrict F7UtFm0GxudeyxePdC4LVj8i8R2psggtvohOSvhTIlserKo5iyTYFR5WpJnUtmp

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
-- Name: erp_providers; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public.erp_providers (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    "providerType" public."enum_erp_providers_providerType" NOT NULL,
    "apiKey" text NOT NULL,
    "webhookSecret" text NOT NULL,
    "webhookUrl" character varying(255) NOT NULL,
    status public.enum_erp_providers_status DEFAULT 'inactive'::public.enum_erp_providers_status NOT NULL,
    "errorMessage" text,
    "lastSync" timestamp with time zone,
    config json,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.erp_providers OWNER TO chatex;

--
-- Name: erp_providers_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public.erp_providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.erp_providers_id_seq OWNER TO chatex;

--
-- Name: erp_providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public.erp_providers_id_seq OWNED BY public.erp_providers.id;


--
-- Name: erp_providers id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers ALTER COLUMN id SET DEFAULT nextval('public.erp_providers_id_seq'::regclass);


--
-- Data for Name: erp_providers; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.erp_providers (id, "tenantId", "providerType", "apiKey", "webhookSecret", "webhookUrl", status, "errorMessage", "lastSync", config, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: erp_providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.erp_providers_id_seq', 1, false);


--
-- Name: erp_providers erp_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers
    ADD CONSTRAINT erp_providers_pkey PRIMARY KEY (id);


--
-- Name: erp_providers uq_erpproviders_tenantid_providertype; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers
    ADD CONSTRAINT uq_erpproviders_tenantid_providertype UNIQUE ("tenantId", "providerType");


--
-- Name: idx_erpproviders_providertype; Type: INDEX; Schema: public; Owner: chatex
--

CREATE INDEX idx_erpproviders_providertype ON public.erp_providers USING btree ("providerType");


--
-- Name: idx_erpproviders_tenantid; Type: INDEX; Schema: public; Owner: chatex
--

CREATE INDEX idx_erpproviders_tenantid ON public.erp_providers USING btree ("tenantId");


--
-- Name: idx_erpproviders_tenantid_status; Type: INDEX; Schema: public; Owner: chatex
--

CREATE INDEX idx_erpproviders_tenantid_status ON public.erp_providers USING btree ("tenantId", status);


--
-- Name: erp_providers erp_providers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers
    ADD CONSTRAINT "erp_providers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict F7UtFm0GxudeyxePdC4LVj8i8R2psggtvohOSvhTIlserKo5iyTYFR5WpJnUtmp

