--
-- PostgreSQL database dump
--

\restrict KVo0MrFNfGOzPku5twa7ICTQJpWMucMiQmeyBJ2wa4cfonopVxQGfvh0HoXU3sf

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: chatex
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO chatex;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: chatex
--

COMMENT ON SCHEMA public IS '';


--
-- Name: enum_ErpProviders_providerType; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public."enum_ErpProviders_providerType" AS ENUM (
    'vendaerp',
    'bling',
    'omie',
    'mercadopago'
);


ALTER TYPE public."enum_ErpProviders_providerType" OWNER TO chatex;

--
-- Name: enum_ErpProviders_status; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public."enum_ErpProviders_status" AS ENUM (
    'active',
    'inactive',
    'error'
);


ALTER TYPE public."enum_ErpProviders_status" OWNER TO chatex;

--
-- Name: enum_Plans_status; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public."enum_Plans_status" AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public."enum_Plans_status" OWNER TO chatex;

--
-- Name: enum_Subscriptions_status; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public."enum_Subscriptions_status" AS ENUM (
    'pending',
    'active',
    'paused',
    'canceled'
);


ALTER TYPE public."enum_Subscriptions_status" OWNER TO chatex;

--
-- Name: enum_TenantPlans_status; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public."enum_TenantPlans_status" AS ENUM (
    'active',
    'inactive',
    'trial'
);


ALTER TYPE public."enum_TenantPlans_status" OWNER TO chatex;

--
-- Name: enum_Tenants_status; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public."enum_Tenants_status" AS ENUM (
    'active',
    'inactive',
    'suspended',
    'trial'
);


ALTER TYPE public."enum_Tenants_status" OWNER TO chatex;

--
-- Name: enum_erp_providers_providerType; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public."enum_erp_providers_providerType" AS ENUM (
    'vendaerp',
    'bling',
    'omie',
    'mercadopago'
);


ALTER TYPE public."enum_erp_providers_providerType" OWNER TO chatex;

--
-- Name: enum_erp_providers_status; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public.enum_erp_providers_status AS ENUM (
    'active',
    'inactive',
    'error'
);


ALTER TYPE public.enum_erp_providers_status OWNER TO chatex;

--
-- Name: enum_subscriptions_status; Type: TYPE; Schema: public; Owner: chatex
--

CREATE TYPE public.enum_subscriptions_status AS ENUM (
    'pending',
    'active',
    'paused',
    'canceled'
);


ALTER TYPE public.enum_subscriptions_status OWNER TO chatex;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ApiConfigs; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."ApiConfigs" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "sessionId" integer,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    token character varying(255) DEFAULT NULL::character varying,
    "userId" integer,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "urlServiceStatus" text,
    "urlMessageStatus" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "authToken" text
);


ALTER TABLE public."ApiConfigs" OWNER TO chatex;

--
-- Name: ApiMessages; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."ApiMessages" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "messageId" character varying(255) DEFAULT NULL::character varying,
    "externalKey" character varying(255) DEFAULT NULL::character varying,
    body text NOT NULL,
    ack integer DEFAULT 0 NOT NULL,
    number character varying(255) NOT NULL,
    "mediaName" text,
    "timestamp" integer,
    "sessionId" integer,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "messageWA" jsonb,
    "apiConfig" jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "mediaUrl" text
);


ALTER TABLE public."ApiMessages" OWNER TO chatex;

--
-- Name: AutoReply; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."AutoReply" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    action integer DEFAULT 0 NOT NULL,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "celularTeste" character varying(255) DEFAULT NULL::character varying,
    "tenantId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."AutoReply" OWNER TO chatex;

--
-- Name: AutoReplyLogs; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."AutoReplyLogs" (
    id integer NOT NULL,
    "autoReplyId" integer NOT NULL,
    "autoReplyName" character varying(255) NOT NULL,
    "stepsReplyId" integer NOT NULL,
    "stepsReplyMessage" character varying(255) NOT NULL,
    "wordsReply" character varying(255) NOT NULL,
    "contactId" integer,
    "ticketId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."AutoReplyLogs" OWNER TO chatex;

--
-- Name: AutoReplyLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."AutoReplyLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AutoReplyLogs_id_seq" OWNER TO chatex;

--
-- Name: AutoReplyLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."AutoReplyLogs_id_seq" OWNED BY public."AutoReplyLogs".id;


--
-- Name: AutoReply_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."AutoReply_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AutoReply_id_seq" OWNER TO chatex;

--
-- Name: AutoReply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."AutoReply_id_seq" OWNED BY public."AutoReply".id;


--
-- Name: CampaignContacts; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."CampaignContacts" (
    id integer NOT NULL,
    "messageRandom" character varying(255) NOT NULL,
    body text,
    "mediaName" character varying(255) DEFAULT NULL::character varying,
    "messageId" character varying(255) DEFAULT NULL::character varying,
    "jobId" character varying(255) DEFAULT NULL::character varying,
    ack integer DEFAULT 0 NOT NULL,
    "timestamp" integer,
    "contactId" integer,
    "campaignId" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CampaignContacts" OWNER TO chatex;

--
-- Name: CampaignContacts_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."CampaignContacts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CampaignContacts_id_seq" OWNER TO chatex;

--
-- Name: CampaignContacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."CampaignContacts_id_seq" OWNED BY public."CampaignContacts".id;


--
-- Name: Campaigns; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Campaigns" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    start timestamp with time zone NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    "sessionId" integer,
    message1 text NOT NULL,
    message2 text NOT NULL,
    message3 text NOT NULL,
    "mediaUrl" character varying(255) DEFAULT NULL::character varying,
    "mediaType" character varying(255) DEFAULT NULL::character varying,
    "userId" integer,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    delay integer DEFAULT 20 NOT NULL
);


ALTER TABLE public."Campaigns" OWNER TO chatex;

--
-- Name: Campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Campaigns_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Campaigns_id_seq" OWNER TO chatex;

--
-- Name: Campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Campaigns_id_seq" OWNED BY public."Campaigns".id;


--
-- Name: ChatFlow; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."ChatFlow" (
    id integer NOT NULL,
    name character varying(255) DEFAULT ''::character varying NOT NULL,
    flow json DEFAULT '{}'::json NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "celularTeste" character varying(255) DEFAULT NULL::character varying,
    "userId" integer,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isDeleted" boolean DEFAULT false
);


ALTER TABLE public."ChatFlow" OWNER TO chatex;

--
-- Name: ChatFlow_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."ChatFlow_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ChatFlow_id_seq" OWNER TO chatex;

--
-- Name: ChatFlow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."ChatFlow_id_seq" OWNED BY public."ChatFlow".id;


--
-- Name: ContactCustomFields; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."ContactCustomFields" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255) NOT NULL,
    "contactId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ContactCustomFields" OWNER TO chatex;

--
-- Name: ContactCustomFields_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."ContactCustomFields_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ContactCustomFields_id_seq" OWNER TO chatex;

--
-- Name: ContactCustomFields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."ContactCustomFields_id_seq" OWNED BY public."ContactCustomFields".id;


--
-- Name: ContactTags; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."ContactTags" (
    id integer NOT NULL,
    "tagId" integer NOT NULL,
    "contactId" integer NOT NULL,
    "tenantId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ContactTags" OWNER TO chatex;

--
-- Name: ContactTags_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."ContactTags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ContactTags_id_seq" OWNER TO chatex;

--
-- Name: ContactTags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."ContactTags_id_seq" OWNED BY public."ContactTags".id;


--
-- Name: ContactWallets; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."ContactWallets" (
    id integer NOT NULL,
    "walletId" integer NOT NULL,
    "contactId" integer NOT NULL,
    "tenantId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ContactWallets" OWNER TO chatex;

--
-- Name: ContactWallets_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."ContactWallets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ContactWallets_id_seq" OWNER TO chatex;

--
-- Name: ContactWallets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."ContactWallets_id_seq" OWNED BY public."ContactWallets".id;


--
-- Name: Contacts; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Contacts" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    number character varying(255) DEFAULT NULL::character varying,
    "profilePicUrl" text DEFAULT NULL::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    email character varying(255) DEFAULT NULL::character varying,
    "isGroup" boolean DEFAULT false NOT NULL,
    "tenantId" integer DEFAULT 1 NOT NULL,
    pushname character varying(255) DEFAULT NULL::character varying,
    "isUser" boolean,
    "isWAContact" boolean,
    "telegramId" bigint,
    "instagramPK" bigint,
    "messengerId" text
);


ALTER TABLE public."Contacts" OWNER TO chatex;

--
-- Name: Contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Contacts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Contacts_id_seq" OWNER TO chatex;

--
-- Name: Contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Contacts_id_seq" OWNED BY public."Contacts".id;


--
-- Name: ErpProviders; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."ErpProviders" (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    "providerType" public."enum_ErpProviders_providerType" NOT NULL,
    "apiKey" text NOT NULL,
    "webhookSecret" text NOT NULL,
    "webhookUrl" character varying(255),
    status public."enum_ErpProviders_status" DEFAULT 'inactive'::public."enum_ErpProviders_status" NOT NULL,
    "errorMessage" text,
    "lastSync" timestamp with time zone,
    config jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ErpProviders" OWNER TO chatex;

--
-- Name: ErpProviders_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."ErpProviders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ErpProviders_id_seq" OWNER TO chatex;

--
-- Name: ErpProviders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."ErpProviders_id_seq" OWNED BY public."ErpProviders".id;


--
-- Name: FastReply; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."FastReply" (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    message text NOT NULL,
    "userId" integer,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."FastReply" OWNER TO chatex;

--
-- Name: FastReply_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."FastReply_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."FastReply_id_seq" OWNER TO chatex;

--
-- Name: FastReply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."FastReply_id_seq" OWNED BY public."FastReply".id;


--
-- Name: LogTickets; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."LogTickets" (
    id integer NOT NULL,
    "userId" integer,
    "ticketId" integer NOT NULL,
    "queueId" integer,
    type character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."LogTickets" OWNER TO chatex;

--
-- Name: LogTickets_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."LogTickets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."LogTickets_id_seq" OWNER TO chatex;

--
-- Name: LogTickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."LogTickets_id_seq" OWNED BY public."LogTickets".id;


--
-- Name: Messages; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Messages" (
    id character varying(255) NOT NULL,
    body text NOT NULL,
    ack integer DEFAULT 0 NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "mediaType" character varying(255),
    "mediaUrl" character varying(255),
    "ticketId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "fromMe" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "contactId" integer,
    "quotedMsgId" character varying(255),
    "timestamp" bigint,
    "userId" integer,
    "scheduleDate" timestamp with time zone,
    "sendType" character varying(255) DEFAULT NULL::character varying,
    "messageId" character varying(255) DEFAULT NULL::character varying,
    status character varying(255) DEFAULT NULL::character varying,
    "wabaMediaId" text,
    "tenantId" integer,
    "idFront" character varying(255) DEFAULT NULL::character varying,
    edited text
);


ALTER TABLE public."Messages" OWNER TO chatex;

--
-- Name: MessagesOffLine; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."MessagesOffLine" (
    id integer NOT NULL,
    body text NOT NULL,
    ack integer DEFAULT 0 NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "mediaType" character varying(255),
    "mediaUrl" character varying(255),
    "userId" integer,
    "ticketId" integer NOT NULL,
    "fromMe" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "contactId" integer,
    "quotedMsgId" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."MessagesOffLine" OWNER TO chatex;

--
-- Name: MessagesOffLine_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."MessagesOffLine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."MessagesOffLine_id_seq" OWNER TO chatex;

--
-- Name: MessagesOffLine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."MessagesOffLine_id_seq" OWNED BY public."MessagesOffLine".id;


--
-- Name: Plans; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Plans" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    limits jsonb,
    features jsonb,
    status public."enum_Plans_status" DEFAULT 'active'::public."enum_Plans_status",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Plans" OWNER TO chatex;

--
-- Name: Plans_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Plans_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Plans_id_seq" OWNER TO chatex;

--
-- Name: Plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Plans_id_seq" OWNED BY public."Plans".id;


--
-- Name: Queues; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Queues" (
    id integer NOT NULL,
    queue character varying(255) NOT NULL,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "tenantId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Queues" OWNER TO chatex;

--
-- Name: Queues_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Queues_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Queues_id_seq" OWNER TO chatex;

--
-- Name: Queues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Queues_id_seq" OWNED BY public."Queues".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO chatex;

--
-- Name: Settings; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Settings" (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "tenantId" integer DEFAULT 1 NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."Settings" OWNER TO chatex;

--
-- Name: Settings_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Settings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Settings_id_seq" OWNER TO chatex;

--
-- Name: Settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Settings_id_seq" OWNED BY public."Settings".id;


--
-- Name: StepsReply; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."StepsReply" (
    id integer NOT NULL,
    reply character varying(255) NOT NULL,
    "idAutoReply" integer,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "initialStep" boolean DEFAULT false
);


ALTER TABLE public."StepsReply" OWNER TO chatex;

--
-- Name: StepsReplyActions; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."StepsReplyActions" (
    id integer NOT NULL,
    "stepReplyId" integer,
    words character varying(255) NOT NULL,
    action integer DEFAULT 0 NOT NULL,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "nextStepId" integer,
    "queueId" integer,
    "userIdDestination" integer,
    "replyDefinition" character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public."StepsReplyActions" OWNER TO chatex;

--
-- Name: StepsReplyActions_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."StepsReplyActions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."StepsReplyActions_id_seq" OWNER TO chatex;

--
-- Name: StepsReplyActions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."StepsReplyActions_id_seq" OWNED BY public."StepsReplyActions".id;


--
-- Name: StepsReply_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."StepsReply_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."StepsReply_id_seq" OWNER TO chatex;

--
-- Name: StepsReply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."StepsReply_id_seq" OWNED BY public."StepsReply".id;


--
-- Name: Subscriptions; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Subscriptions" (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    "planId" integer NOT NULL,
    "erpProviderId" integer,
    "externalInvoiceId" character varying(255),
    status public."enum_Subscriptions_status" DEFAULT 'pending'::public."enum_Subscriptions_status" NOT NULL,
    amount numeric(10,2),
    "currentPeriodStart" timestamp with time zone,
    "currentPeriodEnd" timestamp with time zone,
    "cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
    "paidAt" timestamp with time zone,
    "canceledAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Subscriptions" OWNER TO chatex;

--
-- Name: Subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Subscriptions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Subscriptions_id_seq" OWNER TO chatex;

--
-- Name: Subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Subscriptions_id_seq" OWNED BY public."Subscriptions".id;


--
-- Name: Tags; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Tags" (
    id integer NOT NULL,
    tag character varying(255) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    color character varying(255) NOT NULL,
    "userId" integer,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Tags" OWNER TO chatex;

--
-- Name: Tags_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tags_id_seq" OWNER TO chatex;

--
-- Name: Tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Tags_id_seq" OWNED BY public."Tags".id;


--
-- Name: TenantPlans; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."TenantPlans" (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    "planId" integer NOT NULL,
    status public."enum_TenantPlans_status" DEFAULT 'active'::public."enum_TenantPlans_status",
    "subscriptionId" integer,
    "currentPeriodStart" timestamp with time zone,
    "currentPeriodEnd" timestamp with time zone,
    "cancelAtPeriodEnd" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."TenantPlans" OWNER TO chatex;

--
-- Name: TenantPlans_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."TenantPlans_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."TenantPlans_id_seq" OWNER TO chatex;

--
-- Name: TenantPlans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."TenantPlans_id_seq" OWNED BY public."TenantPlans".id;


--
-- Name: Tenants; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Tenants" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    cnpj character varying(255),
    email character varying(255),
    status public."enum_Tenants_status" DEFAULT 'active'::public."enum_Tenants_status" NOT NULL,
    "ownerId" integer,
    "maxUsers" integer NOT NULL,
    "maxConnections" integer NOT NULL,
    "businessHours" jsonb,
    "messageBusinessHours" text,
    "trialEndsAt" timestamp with time zone,
    "suspendedAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    owner_id integer
);


ALTER TABLE public."Tenants" OWNER TO chatex;

--
-- Name: Tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Tenants_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tenants_id_seq" OWNER TO chatex;

--
-- Name: Tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Tenants_id_seq" OWNED BY public."Tenants".id;


--
-- Name: Tickets; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Tickets" (
    id integer NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    "lastMessage" text,
    "contactId" integer,
    "userId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "whatsappId" integer,
    "isGroup" boolean DEFAULT false NOT NULL,
    "autoReplyId" integer,
    "stepAutoReplyId" integer,
    "queueId" integer,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "unreadMessages" integer,
    answered boolean DEFAULT true,
    channel character varying(255) DEFAULT 'whatsapp'::character varying,
    "chatFlowId" integer,
    "stepChatFlow" character varying(255) DEFAULT NULL::character varying,
    "lastMessageAt" bigint,
    "startedAttendanceAt" bigint,
    "closedAt" bigint,
    "isActiveDemand" boolean DEFAULT false NOT NULL,
    "botRetries" integer DEFAULT 0 NOT NULL,
    "lastInteractionBot" timestamp with time zone,
    "apiConfig" jsonb,
    "isFarewellMessage" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Tickets" OWNER TO chatex;

--
-- Name: Tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Tickets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tickets_id_seq" OWNER TO chatex;

--
-- Name: Tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Tickets_id_seq" OWNED BY public."Tickets".id;


--
-- Name: UserMessagesLog; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."UserMessagesLog" (
    id integer NOT NULL,
    "messageId" character varying(255) DEFAULT NULL::character varying,
    "userId" integer,
    "ticketId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserMessagesLog" OWNER TO chatex;

--
-- Name: UserMessagesLog_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."UserMessagesLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UserMessagesLog_id_seq" OWNER TO chatex;

--
-- Name: UserMessagesLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."UserMessagesLog_id_seq" OWNED BY public."UserMessagesLog".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    profile character varying(255) DEFAULT 'admin'::character varying NOT NULL,
    "tokenVersion" integer DEFAULT 0 NOT NULL,
    "tenantId" integer DEFAULT 1 NOT NULL,
    "lastLogin" timestamp with time zone,
    "lastLogout" timestamp with time zone,
    "isOnline" boolean DEFAULT false,
    configs json,
    "lastOnline" timestamp with time zone,
    status character varying(255) DEFAULT 'offline'::character varying NOT NULL
);


ALTER TABLE public."Users" OWNER TO chatex;

--
-- Name: UsersQueues; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."UsersQueues" (
    id integer NOT NULL,
    "queueId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UsersQueues" OWNER TO chatex;

--
-- Name: UsersQueues_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."UsersQueues_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."UsersQueues_id_seq" OWNER TO chatex;

--
-- Name: UsersQueues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."UsersQueues_id_seq" OWNED BY public."UsersQueues".id;


--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO chatex;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Whatsapps; Type: TABLE; Schema: public; Owner: chatex
--

CREATE TABLE public."Whatsapps" (
    id integer NOT NULL,
    session text,
    qrcode text,
    status character varying(255),
    battery character varying(255),
    plugged boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    retries integer DEFAULT 0 NOT NULL,
    "tenantId" integer DEFAULT 1 NOT NULL,
    number character varying(255) DEFAULT NULL::character varying,
    phone jsonb,
    "isDeleted" boolean DEFAULT false,
    "tokenTelegram" character varying(255) DEFAULT NULL::character varying,
    type character varying(255) DEFAULT 'whatsapp'::character varying NOT NULL,
    "instagramUser" character varying(255) DEFAULT NULL::character varying,
    "instagramKey" character varying(255) DEFAULT NULL::character varying,
    "tokenAPI" text,
    "wabaBSP" character varying(255) DEFAULT NULL::character varying,
    "tokenHook" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "fbPageId" text,
    "fbObject" jsonb,
    "farewellMessage" text,
    "chatFlowId" integer,
    name character varying(255) NOT NULL,
    wavoip text,
    "queueId" integer
);


ALTER TABLE public."Whatsapps" OWNER TO chatex;

--
-- Name: Whatsapps_id_seq; Type: SEQUENCE; Schema: public; Owner: chatex
--

CREATE SEQUENCE public."Whatsapps_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Whatsapps_id_seq" OWNER TO chatex;

--
-- Name: Whatsapps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chatex
--

ALTER SEQUENCE public."Whatsapps_id_seq" OWNED BY public."Whatsapps".id;


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
-- Name: AutoReply id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReply" ALTER COLUMN id SET DEFAULT nextval('public."AutoReply_id_seq"'::regclass);


--
-- Name: AutoReplyLogs id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReplyLogs" ALTER COLUMN id SET DEFAULT nextval('public."AutoReplyLogs_id_seq"'::regclass);


--
-- Name: CampaignContacts id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."CampaignContacts" ALTER COLUMN id SET DEFAULT nextval('public."CampaignContacts_id_seq"'::regclass);


--
-- Name: Campaigns id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Campaigns" ALTER COLUMN id SET DEFAULT nextval('public."Campaigns_id_seq"'::regclass);


--
-- Name: ChatFlow id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ChatFlow" ALTER COLUMN id SET DEFAULT nextval('public."ChatFlow_id_seq"'::regclass);


--
-- Name: ContactCustomFields id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactCustomFields" ALTER COLUMN id SET DEFAULT nextval('public."ContactCustomFields_id_seq"'::regclass);


--
-- Name: ContactTags id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactTags" ALTER COLUMN id SET DEFAULT nextval('public."ContactTags_id_seq"'::regclass);


--
-- Name: ContactWallets id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactWallets" ALTER COLUMN id SET DEFAULT nextval('public."ContactWallets_id_seq"'::regclass);


--
-- Name: Contacts id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Contacts" ALTER COLUMN id SET DEFAULT nextval('public."Contacts_id_seq"'::regclass);


--
-- Name: ErpProviders id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ErpProviders" ALTER COLUMN id SET DEFAULT nextval('public."ErpProviders_id_seq"'::regclass);


--
-- Name: FastReply id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."FastReply" ALTER COLUMN id SET DEFAULT nextval('public."FastReply_id_seq"'::regclass);


--
-- Name: LogTickets id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."LogTickets" ALTER COLUMN id SET DEFAULT nextval('public."LogTickets_id_seq"'::regclass);


--
-- Name: MessagesOffLine id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."MessagesOffLine" ALTER COLUMN id SET DEFAULT nextval('public."MessagesOffLine_id_seq"'::regclass);


--
-- Name: Plans id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Plans" ALTER COLUMN id SET DEFAULT nextval('public."Plans_id_seq"'::regclass);


--
-- Name: Queues id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Queues" ALTER COLUMN id SET DEFAULT nextval('public."Queues_id_seq"'::regclass);


--
-- Name: Settings id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Settings" ALTER COLUMN id SET DEFAULT nextval('public."Settings_id_seq"'::regclass);


--
-- Name: StepsReply id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReply" ALTER COLUMN id SET DEFAULT nextval('public."StepsReply_id_seq"'::regclass);


--
-- Name: StepsReplyActions id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReplyActions" ALTER COLUMN id SET DEFAULT nextval('public."StepsReplyActions_id_seq"'::regclass);


--
-- Name: Subscriptions id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Subscriptions" ALTER COLUMN id SET DEFAULT nextval('public."Subscriptions_id_seq"'::regclass);


--
-- Name: Tags id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tags" ALTER COLUMN id SET DEFAULT nextval('public."Tags_id_seq"'::regclass);


--
-- Name: TenantPlans id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."TenantPlans" ALTER COLUMN id SET DEFAULT nextval('public."TenantPlans_id_seq"'::regclass);


--
-- Name: Tenants id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tenants" ALTER COLUMN id SET DEFAULT nextval('public."Tenants_id_seq"'::regclass);


--
-- Name: Tickets id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tickets" ALTER COLUMN id SET DEFAULT nextval('public."Tickets_id_seq"'::regclass);


--
-- Name: UserMessagesLog id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UserMessagesLog" ALTER COLUMN id SET DEFAULT nextval('public."UserMessagesLog_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: UsersQueues id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UsersQueues" ALTER COLUMN id SET DEFAULT nextval('public."UsersQueues_id_seq"'::regclass);


--
-- Name: Whatsapps id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Whatsapps" ALTER COLUMN id SET DEFAULT nextval('public."Whatsapps_id_seq"'::regclass);


--
-- Name: erp_providers id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers ALTER COLUMN id SET DEFAULT nextval('public.erp_providers_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Data for Name: ApiConfigs; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."ApiConfigs" (id, "sessionId", name, "isActive", token, "userId", "tenantId", "urlServiceStatus", "urlMessageStatus", "createdAt", "updatedAt", "authToken") FROM stdin;
\.


--
-- Data for Name: ApiMessages; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."ApiMessages" (id, "messageId", "externalKey", body, ack, number, "mediaName", "timestamp", "sessionId", "tenantId", "messageWA", "apiConfig", "createdAt", "updatedAt", "mediaUrl") FROM stdin;
\.


--
-- Data for Name: AutoReply; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."AutoReply" (id, name, action, "userId", "createdAt", "updatedAt", "isActive", "celularTeste", "tenantId") FROM stdin;
\.


--
-- Data for Name: AutoReplyLogs; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."AutoReplyLogs" (id, "autoReplyId", "autoReplyName", "stepsReplyId", "stepsReplyMessage", "wordsReply", "contactId", "ticketId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CampaignContacts; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."CampaignContacts" (id, "messageRandom", body, "mediaName", "messageId", "jobId", ack, "timestamp", "contactId", "campaignId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Campaigns; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Campaigns" (id, name, start, status, "sessionId", message1, message2, message3, "mediaUrl", "mediaType", "userId", "tenantId", "createdAt", "updatedAt", delay) FROM stdin;
\.


--
-- Data for Name: ChatFlow; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."ChatFlow" (id, name, flow, "isActive", "celularTeste", "userId", "tenantId", "createdAt", "updatedAt", "isDeleted") FROM stdin;
\.


--
-- Data for Name: ContactCustomFields; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."ContactCustomFields" (id, name, value, "contactId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ContactTags; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."ContactTags" (id, "tagId", "contactId", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ContactWallets; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."ContactWallets" (id, "walletId", "contactId", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Contacts; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Contacts" (id, name, number, "profilePicUrl", "createdAt", "updatedAt", email, "isGroup", "tenantId", pushname, "isUser", "isWAContact", "telegramId", "instagramPK", "messengerId") FROM stdin;
\.


--
-- Data for Name: ErpProviders; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."ErpProviders" (id, "tenantId", "providerType", "apiKey", "webhookSecret", "webhookUrl", status, "errorMessage", "lastSync", config, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FastReply; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."FastReply" (id, key, message, "userId", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LogTickets; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."LogTickets" (id, "userId", "ticketId", "queueId", type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Messages" (id, body, ack, read, "mediaType", "mediaUrl", "ticketId", "createdAt", "updatedAt", "fromMe", "isDeleted", "contactId", "quotedMsgId", "timestamp", "userId", "scheduleDate", "sendType", "messageId", status, "wabaMediaId", "tenantId", "idFront", edited) FROM stdin;
\.


--
-- Data for Name: MessagesOffLine; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."MessagesOffLine" (id, body, ack, read, "mediaType", "mediaUrl", "userId", "ticketId", "fromMe", "isDeleted", "contactId", "quotedMsgId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Plans; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Plans" (id, name, price, limits, features, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Queues; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Queues" (id, queue, "userId", "createdAt", "updatedAt", "isActive", "tenantId") FROM stdin;
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."SequelizeMeta" (name) FROM stdin;
20200717133438-create-users.js
20200717144403-create-contacts.js
20200717145643-create-tickets.js
20200717151645-create-messages.js
20200717170223-create-whatsapps.js
20200723200315-create-contacts-custom-fields.js
20200723202116-add-email-field-to-contacts.js
20200730153237-remove-user-association-from-messages.js
20200730153545-add-fromMe-to-messages.js
20200813114236-change-ticket-lastMessage-column-type.js
20200901235509-add-profile-column-to-users.js
20200903215941-create-settings.js
20200906122228-add-name-default-field-to-whatsapp.js
20200906155658-add-whatsapp-field-to-tickets.js
20200919124112-update-default-column-name-on-whatsappp.js
20200927220708-add-isDeleted-column-to-messages.js
20200929145451-add-user-tokenVersion-column.js
20200930162323-add-isGroup-column-to-tickets.js
20200930194808-add-isGroup-column-to-contacts.js
20201004150008-add-contactId-column-to-messages.js
20201004155719-add-vcardContactId-column-to-messages.js
20201004955719-remove-vcardContactId-column-to-messages.js
20201026215410-add-retries-to-whatsapps.js
20201028124427-add-quoted-msg-to-messages.js
20201116231228-create-table-auto-reply.js
20201117004159-alter-column-words-table-auto-reply.js
20201118152407-create-table-steps-reply.js
20201118180019-create-table-steps-reply-action.js
20201119135937-alter-colum-and-table-name-table-auto-reply.js
20201119162119-add-columns-table-steps-reply-actions.js
20201119163016-add-column-userIdDestination-table-steps-reply-actions.js
20201119163017-add-column-autoReplyId-table-ticket.js
20201119163018-add-column-stepAutoReplyId-table-ticket.js
20201121013843-add-column-nextStep-table-steps-reply-actions.js
20201121014717-remove-column-reply-table-steps-reply-actions.js
20201121015611-alter-column-nextStep-table-steps-reply-actions.js
20201121030331-add-column-queue-table-ticket.js
20201121150002-add-column-initialStep-table-steps-auto-reply.js
20201121151458-remove-column-initialStep-table-steps-auto-reply.js
20201121151502-add-column-correct-initialStep-table-steps-auto-reply.js
20201123160210-add-column-old-step-table-ticket.js
20201123172529-remove-column-old-step-table-ticket.js
20201204203210-remove-columns-table-steps-reply.js
20201207215725-create-table-queues.js
20201207222347-alter-column-queue-table-tickets.js
20201208180734-create-table-users-queues.js
20201208222701-alter-column-queue-table-tickets.js
20201209001354-add-column-is-active-table-queues.js
20201210014253-add-column-celular-is-active-auto-reply.js
20201210022919-alter-columns-queue-userIdDestination-steps-reply-actions.js
20201212040929-add-columns-replyDefinition-table-steps-reply-actions.js
20201220234957-create-table-tenant.js
20201221010713-add-tenantId-all-tables.js
20201222035938-add-contraint-contato-number-tenantId.js
20201222041830-remove-contraint-contacts-number-key.js
20201226152811-add-number-phone-table-whatsapps.js
20201229205500-add-column-isDeleted-table-whatsapps.js
20201230151109-create-table-record-auto-reply.js
20210112195446-add-columns-pushname__isUser__isWAContact.js
20210113001629-add-columns-unreadMessages-to-tickets.js
20210113145013-add-column-timestamp-to-Messages.js
20210123165336-create-table-messageOffLine.js
20210125180503-add-column-userId-to-table-messages.js
20210126144647-create-table-UserMessagesLog.js
20210202160551-alter-primarykey-settings.js
20210202163058-delete-constraite-primarykey-settings.js
20210206001325-alter-column-email-table-contacts.js
20210207131524-create-table-fastReply.js
20210209030321-add-column-tokenTelegram-table-whatsapp.js
20210209193520-add-column-type-table-whatsapps.js
20210219213513-create-table-tags.js
20210219213514-create-constraint-table-tags.js
20210220004040-create-table-tags-contact.js
20210220180824-add-column-businessHours-to-tenants.js
20210220180935-add-column-messageBusinessHours-to-tenants.js
20210227000928-create-table-campaign.js
20210227021721-create-table-campaign-contacts.js
20210308153511-create-extension-uuid-ossp-postgres.js
20210308174543-create-table-ApiConfigs.js
20210309200505-create-table-ApiMessages.js
20210316015754-add-column-mediaUrl-table-ApiMessages.js
20210719011137-add-columns-status-scheduleDate--table-Message.js
20210721022925-copy-rows-field_id-to-messageId_table-message.js
20210721052241-drop-reference-quotedMsgId-table-messages.js
20210727030857-add-columns-isOnline_lastLogin-table-users.js
20210727193355-create-table-wallets-contact.js
20210810043718-add-column-configs-table-users.js
20210814012545-add-column-answered-table-tickets.js
20210815021807-create-table-LogTickets.js
20211115225207-add-telegramId-table-contact.js
20211116005230-add-column-channel-table-ticket.js
20211116011624-alter-column-type-table-whatsapp.js
20211126182602-add-table-chatFlow.js
20211129152556-alter-columns-table-ticket.js
20211203014144-add-columns-instagram-table-contact.js
20211203030434-alter-columns-profilePicUrl-table-contact.js
20211203142749-alter-columns-timestamp-table-messages.js
20211203201930-alter-columns-instagramPK-table-contacts.js
20211204211026-remove-column-closedAt-table-tickets.js
20211222004728-add-colum-wabaApiKey-table-whatsapps.js
20211227160721-add-colum-isActive-table-whatsapps.js
20220101191958-add-colum-tenantId-table-messages.js
20220107020301-rename-colum-wabaKeyHook-table-whatsapps.js
20220108003843-add-colum-messengerId-table-contacts.js
20240522000001-alter_table_tenant.js
20250102000000-fix-table-names-to-pascal-case.js
20211204211101-add-columns-startAttendanceAt_lastMessageAt-table-tickets.js
20211205004359-add-columns-isActiveDemand-table-tickets.js
20211217140835-add-columns_botRetry_lastBotInteraction_table-tickets.js
20211222004247-add-colum-wabaMediaId-table-messages.js
20211209174149-add-columns-instagramUser_instagramPassword-table-Whatsapps.js
20211212200504-add-column-id-table-settings.js
20211214214935-add-column-lastOnline-table-users.js
20211215211539-add-column-status-table-users.js
20220111160338-add-colum-fbPageId-table-whatsapp.js
20220824192600-alter_table_ticket_add_apiConfig.js
20220829163612-alter_table_apiconfigs_add_authToken.js
20221108013747-alter_table_apiconfigs_edit_id_default_value.js
20221108014456-alter_table_ApiMessages_edit_id_default_value.js
20221113222841-alter_table_messages_add_column_idFront.js
20221215203854-alter_connections_from_destryed_to_disconnected.js
20230320063333-add-isDeleted-to-chatFlow.js
20230425153434-create-contacts_number_tenantId.js
20230427013742-alter_table_whatsapps_add_farewellMessage.js
20230427022348-alter_table_tickets_add_isFarewellMessage.js
20230520005335-alter_table_Whatsapps_add_chatFlowId.js
20230620005335-add-column-tenant-add-limit-usercon.js
20230711161553-alter_table_campaign_add_delay.js
20230712040242-query_create_settings_tenants.js
20240519000001-add-colum-edited-table-messages.js
20250218000000-create-erp-providers-table.js
20201221013617-add-name-table-tenants.js
20200904220257-add-name-to-whatsapp.js
20250218000001-create-subscriptions-table.js
20250326122300-add-indexes-to-messages.js
20250326140438-add-wavoip-to-whatsapp.js
20250327000001-alter_table_Whatsapps_add_queueId.js
20250327000002-add-owner-id-to-tenants.js
20250101000000-create-billing-tables.js
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Settings" (key, value, "createdAt", "updatedAt", "tenantId", id) FROM stdin;
\.


--
-- Data for Name: StepsReply; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."StepsReply" (id, reply, "idAutoReply", "userId", "createdAt", "updatedAt", "initialStep") FROM stdin;
\.


--
-- Data for Name: StepsReplyActions; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."StepsReplyActions" (id, "stepReplyId", words, action, "userId", "createdAt", "updatedAt", "nextStepId", "queueId", "userIdDestination", "replyDefinition") FROM stdin;
\.


--
-- Data for Name: Subscriptions; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Subscriptions" (id, "tenantId", "planId", "erpProviderId", "externalInvoiceId", status, amount, "currentPeriodStart", "currentPeriodEnd", "cancelAtPeriodEnd", "paidAt", "canceledAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Tags; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Tags" (id, tag, "isActive", color, "userId", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TenantPlans; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."TenantPlans" (id, "tenantId", "planId", status, "subscriptionId", "currentPeriodStart", "currentPeriodEnd", "cancelAtPeriodEnd", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Tenants; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Tenants" (id, name, description, cnpj, email, status, "ownerId", "maxUsers", "maxConnections", "businessHours", "messageBusinessHours", "trialEndsAt", "suspendedAt", "createdAt", "updatedAt", owner_id) FROM stdin;
\.


--
-- Data for Name: Tickets; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Tickets" (id, status, "lastMessage", "contactId", "userId", "createdAt", "updatedAt", "whatsappId", "isGroup", "autoReplyId", "stepAutoReplyId", "queueId", "tenantId", "unreadMessages", answered, channel, "chatFlowId", "stepChatFlow", "lastMessageAt", "startedAttendanceAt", "closedAt", "isActiveDemand", "botRetries", "lastInteractionBot", "apiConfig", "isFarewellMessage") FROM stdin;
\.


--
-- Data for Name: UserMessagesLog; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."UserMessagesLog" (id, "messageId", "userId", "ticketId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Users" (id, name, email, "passwordHash", "createdAt", "updatedAt", profile, "tokenVersion", "tenantId", "lastLogin", "lastLogout", "isOnline", configs, "lastOnline", status) FROM stdin;
\.


--
-- Data for Name: UsersQueues; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."UsersQueues" (id, "queueId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Whatsapps; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public."Whatsapps" (id, session, qrcode, status, battery, plugged, "createdAt", "updatedAt", "isDefault", retries, "tenantId", number, phone, "isDeleted", "tokenTelegram", type, "instagramUser", "instagramKey", "tokenAPI", "wabaBSP", "tokenHook", "isActive", "fbPageId", "fbObject", "farewellMessage", "chatFlowId", name, wavoip, "queueId") FROM stdin;
\.


--
-- Data for Name: erp_providers; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.erp_providers (id, "tenantId", "providerType", "apiKey", "webhookSecret", "webhookUrl", status, "errorMessage", "lastSync", config, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.permissions (id, name, description, module, action, resource, "isSystem", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.role_permissions (id, "roleId", "permissionId", "tenantId", "assignedBy", "grantedAt", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.roles (id, name, description, level, "isSystem", "tenantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: chatex
--

COPY public.user_roles (id, "userId", "roleId", "tenantId", "assignedBy", "expiresAt", "isDefault", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: AutoReplyLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."AutoReplyLogs_id_seq"', 1, false);


--
-- Name: AutoReply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."AutoReply_id_seq"', 1, false);


--
-- Name: CampaignContacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."CampaignContacts_id_seq"', 1, false);


--
-- Name: Campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Campaigns_id_seq"', 1, false);


--
-- Name: ChatFlow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."ChatFlow_id_seq"', 1, false);


--
-- Name: ContactCustomFields_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."ContactCustomFields_id_seq"', 1, false);


--
-- Name: ContactTags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."ContactTags_id_seq"', 1, false);


--
-- Name: ContactWallets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."ContactWallets_id_seq"', 1, false);


--
-- Name: Contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Contacts_id_seq"', 1, false);


--
-- Name: ErpProviders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."ErpProviders_id_seq"', 1, false);


--
-- Name: FastReply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."FastReply_id_seq"', 1, false);


--
-- Name: LogTickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."LogTickets_id_seq"', 1, false);


--
-- Name: MessagesOffLine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."MessagesOffLine_id_seq"', 1, false);


--
-- Name: Plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Plans_id_seq"', 1, false);


--
-- Name: Queues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Queues_id_seq"', 1, false);


--
-- Name: Settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Settings_id_seq"', 1, false);


--
-- Name: StepsReplyActions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."StepsReplyActions_id_seq"', 1, false);


--
-- Name: StepsReply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."StepsReply_id_seq"', 1, false);


--
-- Name: Subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Subscriptions_id_seq"', 1, false);


--
-- Name: Tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Tags_id_seq"', 1, false);


--
-- Name: TenantPlans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."TenantPlans_id_seq"', 1, false);


--
-- Name: Tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Tenants_id_seq"', 1, false);


--
-- Name: Tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Tickets_id_seq"', 1, false);


--
-- Name: UserMessagesLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."UserMessagesLog_id_seq"', 1, false);


--
-- Name: UsersQueues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."UsersQueues_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, false);


--
-- Name: Whatsapps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public."Whatsapps_id_seq"', 1, false);


--
-- Name: erp_providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.erp_providers_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chatex
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 1, false);


--
-- Name: ApiConfigs ApiConfigs_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ApiConfigs"
    ADD CONSTRAINT "ApiConfigs_pkey" PRIMARY KEY (id);


--
-- Name: ApiMessages ApiMessages_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ApiMessages"
    ADD CONSTRAINT "ApiMessages_pkey" PRIMARY KEY (id);


--
-- Name: AutoReplyLogs AutoReplyLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReplyLogs"
    ADD CONSTRAINT "AutoReplyLogs_pkey" PRIMARY KEY (id);


--
-- Name: AutoReply AutoReply_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReply"
    ADD CONSTRAINT "AutoReply_pkey" PRIMARY KEY (id);


--
-- Name: CampaignContacts CampaignContacts_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."CampaignContacts"
    ADD CONSTRAINT "CampaignContacts_pkey" PRIMARY KEY (id);


--
-- Name: Campaigns Campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_pkey" PRIMARY KEY (id);


--
-- Name: ChatFlow ChatFlow_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ChatFlow"
    ADD CONSTRAINT "ChatFlow_pkey" PRIMARY KEY (id);


--
-- Name: ContactCustomFields ContactCustomFields_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactCustomFields"
    ADD CONSTRAINT "ContactCustomFields_pkey" PRIMARY KEY (id);


--
-- Name: ContactTags ContactTags_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactTags"
    ADD CONSTRAINT "ContactTags_pkey" PRIMARY KEY (id);


--
-- Name: ContactWallets ContactWallets_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactWallets"
    ADD CONSTRAINT "ContactWallets_pkey" PRIMARY KEY (id);


--
-- Name: Contacts Contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Contacts"
    ADD CONSTRAINT "Contacts_pkey" PRIMARY KEY (id);


--
-- Name: ErpProviders ErpProviders_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ErpProviders"
    ADD CONSTRAINT "ErpProviders_pkey" PRIMARY KEY (id);


--
-- Name: ErpProviders ErpProviders_tenantId_key; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ErpProviders"
    ADD CONSTRAINT "ErpProviders_tenantId_key" UNIQUE ("tenantId");


--
-- Name: FastReply FastReply_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."FastReply"
    ADD CONSTRAINT "FastReply_pkey" PRIMARY KEY (id);


--
-- Name: LogTickets LogTickets_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."LogTickets"
    ADD CONSTRAINT "LogTickets_pkey" PRIMARY KEY (id);


--
-- Name: MessagesOffLine MessagesOffLine_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."MessagesOffLine"
    ADD CONSTRAINT "MessagesOffLine_pkey" PRIMARY KEY (id);


--
-- Name: Messages Messages_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_pkey" PRIMARY KEY (id);


--
-- Name: Plans Plans_name_key; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Plans"
    ADD CONSTRAINT "Plans_name_key" UNIQUE (name);


--
-- Name: Plans Plans_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Plans"
    ADD CONSTRAINT "Plans_pkey" PRIMARY KEY (id);


--
-- Name: Queues Queues_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Queues"
    ADD CONSTRAINT "Queues_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: StepsReplyActions StepsReplyActions_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReplyActions"
    ADD CONSTRAINT "StepsReplyActions_pkey" PRIMARY KEY (id);


--
-- Name: StepsReply StepsReply_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReply"
    ADD CONSTRAINT "StepsReply_pkey" PRIMARY KEY (id);


--
-- Name: Subscriptions Subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Subscriptions"
    ADD CONSTRAINT "Subscriptions_pkey" PRIMARY KEY (id);


--
-- Name: Tags Tags_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tags"
    ADD CONSTRAINT "Tags_pkey" PRIMARY KEY (id);


--
-- Name: TenantPlans TenantPlans_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."TenantPlans"
    ADD CONSTRAINT "TenantPlans_pkey" PRIMARY KEY (id);


--
-- Name: Tenants Tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tenants"
    ADD CONSTRAINT "Tenants_pkey" PRIMARY KEY (id);


--
-- Name: Tickets Tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_pkey" PRIMARY KEY (id);


--
-- Name: UserMessagesLog UserMessagesLog_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UserMessagesLog"
    ADD CONSTRAINT "UserMessagesLog_pkey" PRIMARY KEY (id);


--
-- Name: UsersQueues UsersQueues_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UsersQueues"
    ADD CONSTRAINT "UsersQueues_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Whatsapps Whatsapps_name_key; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Whatsapps"
    ADD CONSTRAINT "Whatsapps_name_key" UNIQUE (name);


--
-- Name: Whatsapps Whatsapps_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Whatsapps"
    ADD CONSTRAINT "Whatsapps_pkey" PRIMARY KEY (id);


--
-- Name: erp_providers erp_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers
    ADD CONSTRAINT erp_providers_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: Tags unique_constraint_tag_tenant; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tags"
    ADD CONSTRAINT unique_constraint_tag_tenant UNIQUE (tag, "tenantId");


--
-- Name: erp_providers uq_erpproviders_tenantid_providertype; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers
    ADD CONSTRAINT uq_erpproviders_tenantid_providertype UNIQUE ("tenantId", "providerType");


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: contacts_number_tenantid; Type: INDEX; Schema: public; Owner: chatex
--

CREATE UNIQUE INDEX contacts_number_tenantid ON public."Contacts" USING btree (number, "tenantId");


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
-- Name: idx_messages_messageid_tenantid; Type: INDEX; Schema: public; Owner: chatex
--

CREATE INDEX idx_messages_messageid_tenantid ON public."Messages" USING btree ("messageId", "tenantId");


--
-- Name: idx_messages_ticketid; Type: INDEX; Schema: public; Owner: chatex
--

CREATE INDEX idx_messages_ticketid ON public."Messages" USING btree ("ticketId");


--
-- Name: ApiConfigs ApiConfigs_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ApiConfigs"
    ADD CONSTRAINT "ApiConfigs_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Whatsapps"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ApiConfigs ApiConfigs_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ApiConfigs"
    ADD CONSTRAINT "ApiConfigs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ApiConfigs ApiConfigs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ApiConfigs"
    ADD CONSTRAINT "ApiConfigs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ApiMessages ApiMessages_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ApiMessages"
    ADD CONSTRAINT "ApiMessages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Whatsapps"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ApiMessages ApiMessages_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ApiMessages"
    ADD CONSTRAINT "ApiMessages_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AutoReplyLogs AutoReplyLogs_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReplyLogs"
    ADD CONSTRAINT "AutoReplyLogs_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AutoReplyLogs AutoReplyLogs_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReplyLogs"
    ADD CONSTRAINT "AutoReplyLogs_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Tickets"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AutoReply AutoReply_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReply"
    ADD CONSTRAINT "AutoReply_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AutoReply AutoReply_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."AutoReply"
    ADD CONSTRAINT "AutoReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CampaignContacts CampaignContacts_campaignId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."CampaignContacts"
    ADD CONSTRAINT "CampaignContacts_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES public."Campaigns"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CampaignContacts CampaignContacts_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."CampaignContacts"
    ADD CONSTRAINT "CampaignContacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Campaigns Campaigns_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Whatsapps"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Campaigns Campaigns_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Campaigns Campaigns_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatFlow ChatFlow_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ChatFlow"
    ADD CONSTRAINT "ChatFlow_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChatFlow ChatFlow_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ChatFlow"
    ADD CONSTRAINT "ChatFlow_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactCustomFields ContactCustomFields_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactCustomFields"
    ADD CONSTRAINT "ContactCustomFields_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactTags ContactTags_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactTags"
    ADD CONSTRAINT "ContactTags_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactTags ContactTags_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactTags"
    ADD CONSTRAINT "ContactTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tags"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContactTags ContactTags_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactTags"
    ADD CONSTRAINT "ContactTags_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactWallets ContactWallets_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactWallets"
    ADD CONSTRAINT "ContactWallets_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactWallets ContactWallets_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactWallets"
    ADD CONSTRAINT "ContactWallets_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContactWallets ContactWallets_walletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ContactWallets"
    ADD CONSTRAINT "ContactWallets_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Contacts Contacts_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Contacts"
    ADD CONSTRAINT "Contacts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ErpProviders ErpProviders_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."ErpProviders"
    ADD CONSTRAINT "ErpProviders_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FastReply FastReply_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."FastReply"
    ADD CONSTRAINT "FastReply_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FastReply FastReply_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."FastReply"
    ADD CONSTRAINT "FastReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LogTickets LogTickets_queueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."LogTickets"
    ADD CONSTRAINT "LogTickets_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES public."Queues"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LogTickets LogTickets_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."LogTickets"
    ADD CONSTRAINT "LogTickets_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Tickets"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LogTickets LogTickets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."LogTickets"
    ADD CONSTRAINT "LogTickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessagesOffLine MessagesOffLine_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."MessagesOffLine"
    ADD CONSTRAINT "MessagesOffLine_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessagesOffLine MessagesOffLine_quotedMsgId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."MessagesOffLine"
    ADD CONSTRAINT "MessagesOffLine_quotedMsgId_fkey" FOREIGN KEY ("quotedMsgId") REFERENCES public."Messages"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MessagesOffLine MessagesOffLine_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."MessagesOffLine"
    ADD CONSTRAINT "MessagesOffLine_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Tickets"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MessagesOffLine MessagesOffLine_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."MessagesOffLine"
    ADD CONSTRAINT "MessagesOffLine_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Messages Messages_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages Messages_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Messages Messages_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Tickets"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages Messages_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Queues Queues_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Queues"
    ADD CONSTRAINT "Queues_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Queues Queues_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Queues"
    ADD CONSTRAINT "Queues_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Settings Settings_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StepsReplyActions StepsReplyActions_nextStep_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReplyActions"
    ADD CONSTRAINT "StepsReplyActions_nextStep_fkey" FOREIGN KEY ("nextStepId") REFERENCES public."StepsReply"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StepsReplyActions StepsReplyActions_queueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReplyActions"
    ADD CONSTRAINT "StepsReplyActions_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES public."Queues"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StepsReplyActions StepsReplyActions_stepReplyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReplyActions"
    ADD CONSTRAINT "StepsReplyActions_stepReplyId_fkey" FOREIGN KEY ("stepReplyId") REFERENCES public."StepsReply"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StepsReplyActions StepsReplyActions_userIdDestination_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReplyActions"
    ADD CONSTRAINT "StepsReplyActions_userIdDestination_fkey" FOREIGN KEY ("userIdDestination") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StepsReplyActions StepsReplyActions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReplyActions"
    ADD CONSTRAINT "StepsReplyActions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StepsReply StepsReply_idAutoReply_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReply"
    ADD CONSTRAINT "StepsReply_idAutoReply_fkey" FOREIGN KEY ("idAutoReply") REFERENCES public."AutoReply"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StepsReply StepsReply_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."StepsReply"
    ADD CONSTRAINT "StepsReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Subscriptions Subscriptions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Subscriptions"
    ADD CONSTRAINT "Subscriptions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tags Tags_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tags"
    ADD CONSTRAINT "Tags_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tags Tags_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tags"
    ADD CONSTRAINT "Tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TenantPlans TenantPlans_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."TenantPlans"
    ADD CONSTRAINT "TenantPlans_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."Plans"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantPlans TenantPlans_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."TenantPlans"
    ADD CONSTRAINT "TenantPlans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tenants Tenants_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tenants"
    ADD CONSTRAINT "Tenants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tenants Tenants_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tenants"
    ADD CONSTRAINT "Tenants_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tickets Tickets_contactId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tickets Tickets_queueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES public."Queues"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tickets Tickets_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tickets Tickets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tickets Tickets_whatsappId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_whatsappId_fkey" FOREIGN KEY ("whatsappId") REFERENCES public."Whatsapps"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserMessagesLog UserMessagesLog_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UserMessagesLog"
    ADD CONSTRAINT "UserMessagesLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Tickets"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserMessagesLog UserMessagesLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UserMessagesLog"
    ADD CONSTRAINT "UserMessagesLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UsersQueues UsersQueues_queueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UsersQueues"
    ADD CONSTRAINT "UsersQueues_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES public."Queues"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UsersQueues UsersQueues_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."UsersQueues"
    ADD CONSTRAINT "UsersQueues_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Users Users_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Whatsapps Whatsapps_chatFlowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Whatsapps"
    ADD CONSTRAINT "Whatsapps_chatFlowId_fkey" FOREIGN KEY ("chatFlowId") REFERENCES public."ChatFlow"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Whatsapps Whatsapps_queueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Whatsapps"
    ADD CONSTRAINT "Whatsapps_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES public."Queues"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Whatsapps Whatsapps_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public."Whatsapps"
    ADD CONSTRAINT "Whatsapps_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: erp_providers erp_providers_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.erp_providers
    ADD CONSTRAINT "erp_providers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permissions permissions_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT "permissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
-- Name: roles roles_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chatex
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenants"(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: chatex
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict KVo0MrFNfGOzPku5twa7ICTQJpWMucMiQmeyBJ2wa4cfonopVxQGfvh0HoXU3sf

