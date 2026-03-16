--
-- PostgreSQL database dump
--


-- Dumped from database version 14.21 (Homebrew)
-- Dumped by pg_dump version 14.21 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: deal; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.deal (
    id integer NOT NULL,
    property_id integer,
    buyer_user_id integer,
    seller_user_id integer,
    price numeric,
    status character varying(30) DEFAULT 'OPEN'::character varying,
    "createdAt" timestamp without time zone DEFAULT now()
);



--
-- Name: deal_blockchain_receipt; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.deal_blockchain_receipt (
    id integer NOT NULL,
    deal_id integer,
    contract_hash text NOT NULL,
    blockchain_network character varying(50) NOT NULL,
    tx_hash text,
    created_at timestamp without time zone DEFAULT now(),
    property_id integer NOT NULL,
    buyer_user_id integer NOT NULL,
    seller_user_id integer NOT NULL,
    contract_text text NOT NULL,
    wallet_address text,
    status character varying(30) DEFAULT 'PENDING'::character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);



--
-- Name: deal_blockchain_receipt_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.deal_blockchain_receipt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: deal_blockchain_receipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.deal_blockchain_receipt_id_seq OWNED BY public.deal_blockchain_receipt.id;


--
-- Name: deal_contract; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.deal_contract (
    id integer NOT NULL,
    deal_id integer,
    contract_text text,
    hash text,
    buyer_signed boolean DEFAULT false,
    seller_signed boolean DEFAULT false,
    "createdAt" timestamp without time zone DEFAULT now()
);



--
-- Name: deal_contract_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.deal_contract_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: deal_contract_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.deal_contract_id_seq OWNED BY public.deal_contract.id;


--
-- Name: deal_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.deal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: deal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.deal_id_seq OWNED BY public.deal.id;


--
-- Name: deal_message; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.deal_message (
    id integer NOT NULL,
    deal_id integer,
    sender_user_id integer,
    sender_name text,
    message text,
    "createdAt" timestamp without time zone DEFAULT now()
);



--
-- Name: deal_message_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.deal_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: deal_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.deal_message_id_seq OWNED BY public.deal_message.id;


--
-- Name: diligencias; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.diligencias (
    id integer NOT NULL,
    property_id integer,
    deal_id integer,
    status character varying(30) DEFAULT 'PENDING'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    tipo character varying(30) DEFAULT 'DOCUMENTAL'::character varying,
    detalhes text,
    responsavel character varying(120),
    prioridade character varying(30),
    due_date timestamp without time zone
);



--
-- Name: diligencias_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.diligencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: diligencias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.diligencias_id_seq OWNED BY public.diligencias.id;


--
-- Name: escrow_transaction; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.escrow_transaction (
    id integer NOT NULL,
    deal_id integer NOT NULL,
    buyer_user_id integer NOT NULL,
    seller_user_id integer NOT NULL,
    amount numeric(14,2) NOT NULL,
    status character varying(30) DEFAULT 'AWAITING_PAYMENT'::character varying,
    payment_provider character varying(50),
    provider_reference character varying(120),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- Name: escrow_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.escrow_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: escrow_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.escrow_transaction_id_seq OWNED BY public.escrow_transaction.id;


--
-- Name: property; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.property (
    id integer NOT NULL,
    title text,
    description text,
    price numeric,
    address text,
    city text,
    "userId" integer,
    image text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    status_diligencia text DEFAULT 'PENDENTE'::text,
    score integer DEFAULT 50,
    risk_level text DEFAULT 'HIGH'::text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: property_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.property_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: property_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.property_id_seq OWNED BY public.property.id;


--
-- Name: property_risk; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.property_risk (
    id integer NOT NULL,
    property_id integer NOT NULL,
    seller_score integer,
    property_score integer,
    market_score integer,
    final_score integer,
    risk_level character varying(20),
    details jsonb,
    created_at timestamp without time zone DEFAULT now()
);



--
-- Name: property_risk_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.property_risk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: property_risk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.property_risk_id_seq OWNED BY public.property_risk.id;


--
-- Name: property_trust_snapshot; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.property_trust_snapshot (
    id integer NOT NULL,
    property_id integer NOT NULL,
    evaluation_id integer NOT NULL,
    trust_score integer NOT NULL,
    risk_level character varying(10) NOT NULL,
    summary_short text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: property_trust_snapshot_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.property_trust_snapshot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: property_trust_snapshot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.property_trust_snapshot_id_seq OWNED BY public.property_trust_snapshot.id;


--
-- Name: proposals; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.proposals (
    id integer NOT NULL,
    deal_id integer NOT NULL,
    user_id integer NOT NULL,
    price numeric(14,2) NOT NULL,
    conditions text,
    status character varying(30) DEFAULT 'PENDING'::character varying,
    created_at timestamp without time zone DEFAULT now()
);



--
-- Name: proposals_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.proposals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: proposals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.proposals_id_seq OWNED BY public.proposals.id;


--
-- Name: trust_ai_report; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.trust_ai_report (
    id integer NOT NULL,
    evaluation_id integer NOT NULL,
    headline character varying(200) NOT NULL,
    summary_short text NOT NULL,
    summary_long text NOT NULL,
    legal_opinion text NOT NULL,
    recommended_actions jsonb DEFAULT '[]'::jsonb NOT NULL,
    confidence_level character varying(20) DEFAULT 'MEDIUM'::character varying NOT NULL,
    generated_by character varying(30) DEFAULT 'AI_RULE_LAYER'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: trust_ai_report_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.trust_ai_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: trust_ai_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.trust_ai_report_id_seq OWNED BY public.trust_ai_report.id;


--
-- Name: trust_evaluation; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.trust_evaluation (
    id integer NOT NULL,
    property_id integer,
    document character varying(30) NOT NULL,
    person_type character varying(2) NOT NULL,
    document_status character varying(20),
    judicial_risk character varying(10),
    financial_risk character varying(10),
    identity_risk character varying(10),
    trust_score integer NOT NULL,
    risk_level character varying(10) NOT NULL,
    providers_json jsonb,
    generated_at timestamp without time zone DEFAULT now() NOT NULL,
    deal_id integer,
    subject_document character varying(20),
    subject_type character varying(20),
    engine_version character varying(20),
    evaluation_source character varying(50),
    factors jsonb,
    created_at timestamp without time zone DEFAULT now(),
    score_identity integer DEFAULT 0 NOT NULL,
    score_judicial integer DEFAULT 0 NOT NULL,
    score_financial integer DEFAULT 0 NOT NULL,
    score_property integer DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'COMPLETED'::character varying NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: trust_evaluation_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.trust_evaluation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: trust_evaluation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.trust_evaluation_id_seq OWNED BY public.trust_evaluation.id;


--
-- Name: trust_explanation; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.trust_explanation (
    id integer NOT NULL,
    evaluation_id integer NOT NULL,
    summary_short text NOT NULL,
    summary_long text NOT NULL,
    recommended_actions jsonb DEFAULT '[]'::jsonb NOT NULL,
    generated_by character varying(30) DEFAULT 'RULE_ENGINE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: trust_explanation_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.trust_explanation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: trust_explanation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.trust_explanation_id_seq OWNED BY public.trust_explanation.id;


--
-- Name: trust_provider_result; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.trust_provider_result (
    id integer NOT NULL,
    evaluation_id integer NOT NULL,
    provider_name character varying(50) NOT NULL,
    provider_status character varying(20) NOT NULL,
    raw_payload jsonb NOT NULL,
    normalized_payload jsonb NOT NULL,
    risk_level character varying(10) NOT NULL,
    score_impact integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: trust_provider_result_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.trust_provider_result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: trust_provider_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.trust_provider_result_id_seq OWNED BY public.trust_provider_result.id;


--
-- Name: trust_risk_factor; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.trust_risk_factor (
    id integer NOT NULL,
    evaluation_id integer NOT NULL,
    factor_code character varying(60) NOT NULL,
    dimension character varying(20) NOT NULL,
    severity character varying(10) NOT NULL,
    weight integer NOT NULL,
    title character varying(120) NOT NULL,
    description text NOT NULL,
    source_provider character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);



--
-- Name: trust_risk_factor_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.trust_risk_factor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: trust_risk_factor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.trust_risk_factor_id_seq OWNED BY public.trust_risk_factor.id;


--
-- Name: trust_token; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public.trust_token (
    id integer NOT NULL,
    deal_id integer NOT NULL,
    property_id integer NOT NULL,
    buyer_user_id integer,
    seller_user_id integer,
    trust_score integer NOT NULL,
    risk_level character varying(20) NOT NULL,
    score_version character varying(20) DEFAULT 'v1'::character varying,
    contract_hash text,
    diligence_hash text,
    blockchain_receipt_id integer,
    network character varying(50) DEFAULT 'polygon'::character varying,
    token_reference character varying(120),
    status character varying(20) DEFAULT 'ISSUED'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



--
-- Name: trust_token_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.trust_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: trust_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.trust_token_id_seq OWNED BY public.trust_token.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: antonioterra
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name text,
    email text,
    password text,
    "createdAt" timestamp without time zone DEFAULT now()
);



--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: antonioterra
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonioterra
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: deal id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal ALTER COLUMN id SET DEFAULT nextval('public.deal_id_seq'::regclass);


--
-- Name: deal_blockchain_receipt id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_blockchain_receipt ALTER COLUMN id SET DEFAULT nextval('public.deal_blockchain_receipt_id_seq'::regclass);


--
-- Name: deal_contract id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_contract ALTER COLUMN id SET DEFAULT nextval('public.deal_contract_id_seq'::regclass);


--
-- Name: deal_message id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_message ALTER COLUMN id SET DEFAULT nextval('public.deal_message_id_seq'::regclass);


--
-- Name: diligencias id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.diligencias ALTER COLUMN id SET DEFAULT nextval('public.diligencias_id_seq'::regclass);


--
-- Name: escrow_transaction id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.escrow_transaction ALTER COLUMN id SET DEFAULT nextval('public.escrow_transaction_id_seq'::regclass);


--
-- Name: property id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property ALTER COLUMN id SET DEFAULT nextval('public.property_id_seq'::regclass);


--
-- Name: property_risk id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property_risk ALTER COLUMN id SET DEFAULT nextval('public.property_risk_id_seq'::regclass);


--
-- Name: property_trust_snapshot id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property_trust_snapshot ALTER COLUMN id SET DEFAULT nextval('public.property_trust_snapshot_id_seq'::regclass);


--
-- Name: proposals id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.proposals ALTER COLUMN id SET DEFAULT nextval('public.proposals_id_seq'::regclass);


--
-- Name: trust_ai_report id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_ai_report ALTER COLUMN id SET DEFAULT nextval('public.trust_ai_report_id_seq'::regclass);


--
-- Name: trust_evaluation id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_evaluation ALTER COLUMN id SET DEFAULT nextval('public.trust_evaluation_id_seq'::regclass);


--
-- Name: trust_explanation id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_explanation ALTER COLUMN id SET DEFAULT nextval('public.trust_explanation_id_seq'::regclass);


--
-- Name: trust_provider_result id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_provider_result ALTER COLUMN id SET DEFAULT nextval('public.trust_provider_result_id_seq'::regclass);


--
-- Name: trust_risk_factor id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_risk_factor ALTER COLUMN id SET DEFAULT nextval('public.trust_risk_factor_id_seq'::regclass);


--
-- Name: trust_token id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_token ALTER COLUMN id SET DEFAULT nextval('public.trust_token_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: deal_blockchain_receipt deal_blockchain_receipt_deal_id_key; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_blockchain_receipt
    ADD CONSTRAINT deal_blockchain_receipt_deal_id_key UNIQUE (deal_id);


--
-- Name: deal_blockchain_receipt deal_blockchain_receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_blockchain_receipt
    ADD CONSTRAINT deal_blockchain_receipt_pkey PRIMARY KEY (id);


--
-- Name: deal_contract deal_contract_deal_id_key; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_contract
    ADD CONSTRAINT deal_contract_deal_id_key UNIQUE (deal_id);


--
-- Name: deal_contract deal_contract_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_contract
    ADD CONSTRAINT deal_contract_pkey PRIMARY KEY (id);


--
-- Name: deal_message deal_message_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal_message
    ADD CONSTRAINT deal_message_pkey PRIMARY KEY (id);


--
-- Name: deal deal_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.deal
    ADD CONSTRAINT deal_pkey PRIMARY KEY (id);


--
-- Name: diligencias diligencias_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.diligencias
    ADD CONSTRAINT diligencias_pkey PRIMARY KEY (id);


--
-- Name: escrow_transaction escrow_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.escrow_transaction
    ADD CONSTRAINT escrow_transaction_pkey PRIMARY KEY (id);


--
-- Name: property property_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_pkey PRIMARY KEY (id);


--
-- Name: property_risk property_risk_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property_risk
    ADD CONSTRAINT property_risk_pkey PRIMARY KEY (id);


--
-- Name: property_trust_snapshot property_trust_snapshot_evaluation_id_key; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property_trust_snapshot
    ADD CONSTRAINT property_trust_snapshot_evaluation_id_key UNIQUE (evaluation_id);


--
-- Name: property_trust_snapshot property_trust_snapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property_trust_snapshot
    ADD CONSTRAINT property_trust_snapshot_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: trust_ai_report trust_ai_report_evaluation_id_key; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_ai_report
    ADD CONSTRAINT trust_ai_report_evaluation_id_key UNIQUE (evaluation_id);


--
-- Name: trust_ai_report trust_ai_report_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_ai_report
    ADD CONSTRAINT trust_ai_report_pkey PRIMARY KEY (id);


--
-- Name: trust_evaluation trust_evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_evaluation
    ADD CONSTRAINT trust_evaluation_pkey PRIMARY KEY (id);


--
-- Name: trust_explanation trust_explanation_evaluation_id_key; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_explanation
    ADD CONSTRAINT trust_explanation_evaluation_id_key UNIQUE (evaluation_id);


--
-- Name: trust_explanation trust_explanation_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_explanation
    ADD CONSTRAINT trust_explanation_pkey PRIMARY KEY (id);


--
-- Name: trust_provider_result trust_provider_result_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_provider_result
    ADD CONSTRAINT trust_provider_result_pkey PRIMARY KEY (id);


--
-- Name: trust_risk_factor trust_risk_factor_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_risk_factor
    ADD CONSTRAINT trust_risk_factor_pkey PRIMARY KEY (id);


--
-- Name: trust_token trust_token_deal_id_key; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_token
    ADD CONSTRAINT trust_token_deal_id_key UNIQUE (deal_id);


--
-- Name: trust_token trust_token_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_token
    ADD CONSTRAINT trust_token_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: escrow_deal_unique; Type: INDEX; Schema: public; Owner: antonioterra
--

CREATE UNIQUE INDEX escrow_deal_unique ON public.escrow_transaction USING btree (deal_id);


--
-- Name: escrow_transaction escrow_buyer_fk; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.escrow_transaction
    ADD CONSTRAINT escrow_buyer_fk FOREIGN KEY (buyer_user_id) REFERENCES public."user"(id) ON DELETE RESTRICT;


--
-- Name: escrow_transaction escrow_seller_fk; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.escrow_transaction
    ADD CONSTRAINT escrow_seller_fk FOREIGN KEY (seller_user_id) REFERENCES public."user"(id) ON DELETE RESTRICT;


--
-- Name: property_trust_snapshot property_trust_snapshot_evaluation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property_trust_snapshot
    ADD CONSTRAINT property_trust_snapshot_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES public.trust_evaluation(id) ON DELETE CASCADE;


--
-- Name: property property_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_user_fk FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: trust_ai_report trust_ai_report_evaluation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_ai_report
    ADD CONSTRAINT trust_ai_report_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES public.trust_evaluation(id) ON DELETE CASCADE;


--
-- Name: trust_explanation trust_explanation_evaluation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_explanation
    ADD CONSTRAINT trust_explanation_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES public.trust_evaluation(id) ON DELETE CASCADE;


--
-- Name: trust_provider_result trust_provider_result_evaluation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_provider_result
    ADD CONSTRAINT trust_provider_result_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES public.trust_evaluation(id) ON DELETE CASCADE;


--
-- Name: trust_risk_factor trust_risk_factor_evaluation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: antonioterra
--

ALTER TABLE ONLY public.trust_risk_factor
    ADD CONSTRAINT trust_risk_factor_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES public.trust_evaluation(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


