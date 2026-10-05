-- =====================================================================
-- Liga Veteranos do Sado — photo_url a apontar para as fotos renomeadas
--                                                   PROPOSTA, NAO APLICADA
-- ---------------------------------------------------------------------
-- O PR "chore(photos): refresh Botafogo, Pontes and Sado squad photos
-- for 2026/27" renomeou ficheiros em public/team_photos (PNG -> JPEG no
-- Botafogo) e moveu as fotos de quem mudou de clube. A base de dados
-- continua a apontar para os caminhos antigos, por isso os avatares
-- desses jogadores ficam vazios ate esta correcao ser aplicada.
--
-- So mexe em duas colunas de texto (players.photo_url,
-- teams.manager_photo_url). Nao altera esquema, triggers nem politicas.
-- E idempotente: correr duas vezes nao faz nada na segunda.
--
-- Rollback: docs/db/07_photo_url_fix_rollback.sql — nao e um simples
-- "novo -> antigo", porque as linhas da epoca atual ja apontavam para
-- os caminhos novos antes desta correcao. Ler o cabecalho desse ficheiro.
--
-- Correr por partes, pela ordem, no SQL Editor do Supabase:
--   PARTE 0  verificacao, so SELECT
--   PARTE 1  jogadores — 20 caminhos, renomeacoes 1:1 confirmadas no git
--   PARTE 2  treinador do Botafogo — PRECISA DE CONFIRMACAO (ver nota)
--   PARTE 3  lista das fotos apagadas sem substituto — DECISAO DA DIRECAO
--   PARTE 4  verificacao final, so SELECT
-- =====================================================================


-- ---------------------------------------------------------------------
-- PARTE 0 — Verificacao antes de mexer (so leitura)
-- ---------------------------------------------------------------------
-- Quantas linhas vao ser alteradas por cada caminho antigo.
-- Esperado: 38 linhas de players no total.
with renames(old_url, new_url) as (
  values
    ('/team_photos/botafogo/brunoGuilherme.png',  '/team_photos/botafogo/brunoGuilherme.jpeg'),
    ('/team_photos/botafogo/ermelindoCapelo.png', '/team_photos/botafogo/ermelindoCapelo.jpeg'),
    ('/team_photos/botafogo/filipeCarvalho.png',  '/team_photos/botafogo/filipeCarvalho.jpeg'),
    ('/team_photos/botafogo/filipeMartins.png',   '/team_photos/botafogo/filipeMartins.jpeg'),
    ('/team_photos/botafogo/filipePeralta.png',   '/team_photos/botafogo/filipePeralta.jpeg'),
    ('/team_photos/botafogo/joaoFerreira.png',    '/team_photos/botafogo/joaoFerreira.jpeg'),
    ('/team_photos/botafogo/joaoLopes.png',       '/team_photos/botafogo/joaoLopes.jpeg'),
    ('/team_photos/botafogo/joaoSousa.png',       '/team_photos/botafogo/joaoSousa.jpeg'),
    ('/team_photos/botafogo/miguelNunes.png',     '/team_photos/botafogo/miguelNunes.jpeg'),
    ('/team_photos/botafogo/ricardoFuzeta.png',   '/team_photos/botafogo/ricardoFuzeta.jpeg'),
    ('/team_photos/botafogo/ricardoLopes.png',    '/team_photos/botafogo/ricardoLopes.jpeg'),
    ('/team_photos/botafogo/ricardoMorais.png',   '/team_photos/botafogo/ricardoMorais.jpeg'),
    ('/team_photos/botafogo/rubenMartins.png',    '/team_photos/botafogo/rubenMartins.jpeg'),
    ('/team_photos/botafogo/sergioMarta.png',     '/team_photos/botafogo/sergioMarta.jpeg'),
    ('/team_photos/botafogo/tiagoLeandro.png',    '/team_photos/botafogo/tiagoLeandro.jpeg'),
    ('/team_photos/botafogo/valterBarao.png',     '/team_photos/botafogo/valterBarao.jpeg'),
    ('/team_photos/aguiassaogabriel/eversonSilva.png', '/team_photos/pontes/eversonSilva.png'),
    ('/team_photos/azeda/nunoGouveia.png',             '/team_photos/pontes/nunoGouveia.png'),
    ('/team_photos/sportclubesado/fabioFerreira.png',  '/team_photos/pontes/fabioFerreira.jpg'),
    ('/team_photos/curvas/tiagoMartins.png',           '/team_photos/sportclubesado/tiagoMartins.png')
)
select r.old_url, r.new_url, count(p.id) as linhas
from renames r
left join public.players p on p.photo_url = r.old_url
group by r.old_url, r.new_url
order by r.old_url;


-- ---------------------------------------------------------------------
-- PARTE 1 — Jogadores (20 caminhos, 38 linhas)
-- ---------------------------------------------------------------------
-- Cada par antigo -> novo e uma renomeacao 1:1 detetada pelo git no PR
-- das fotos (R100, ou PNG/JPEG com o mesmo nome na mesma pasta), por
-- isso e o mesmo ficheiro e a mesma pessoa.
--
-- Nas quatro transferencias, as linhas das epocas antigas (2024/2025)
-- passam a apontar para a pasta do clube novo. photo_url e so um
-- caminho e nao define a equipa da epoca (essa vem de teams.season via
-- players.team_id), por isso a foto historica continua correta.
begin;

with renames(old_url, new_url) as (
  values
    ('/team_photos/botafogo/brunoGuilherme.png',  '/team_photos/botafogo/brunoGuilherme.jpeg'),
    ('/team_photos/botafogo/ermelindoCapelo.png', '/team_photos/botafogo/ermelindoCapelo.jpeg'),
    ('/team_photos/botafogo/filipeCarvalho.png',  '/team_photos/botafogo/filipeCarvalho.jpeg'),
    ('/team_photos/botafogo/filipeMartins.png',   '/team_photos/botafogo/filipeMartins.jpeg'),
    ('/team_photos/botafogo/filipePeralta.png',   '/team_photos/botafogo/filipePeralta.jpeg'),
    ('/team_photos/botafogo/joaoFerreira.png',    '/team_photos/botafogo/joaoFerreira.jpeg'),
    ('/team_photos/botafogo/joaoLopes.png',       '/team_photos/botafogo/joaoLopes.jpeg'),
    ('/team_photos/botafogo/joaoSousa.png',       '/team_photos/botafogo/joaoSousa.jpeg'),
    ('/team_photos/botafogo/miguelNunes.png',     '/team_photos/botafogo/miguelNunes.jpeg'),
    ('/team_photos/botafogo/ricardoFuzeta.png',   '/team_photos/botafogo/ricardoFuzeta.jpeg'),
    ('/team_photos/botafogo/ricardoLopes.png',    '/team_photos/botafogo/ricardoLopes.jpeg'),
    ('/team_photos/botafogo/ricardoMorais.png',   '/team_photos/botafogo/ricardoMorais.jpeg'),
    ('/team_photos/botafogo/rubenMartins.png',    '/team_photos/botafogo/rubenMartins.jpeg'),
    ('/team_photos/botafogo/sergioMarta.png',     '/team_photos/botafogo/sergioMarta.jpeg'),
    ('/team_photos/botafogo/tiagoLeandro.png',    '/team_photos/botafogo/tiagoLeandro.jpeg'),
    ('/team_photos/botafogo/valterBarao.png',     '/team_photos/botafogo/valterBarao.jpeg'),
    ('/team_photos/aguiassaogabriel/eversonSilva.png', '/team_photos/pontes/eversonSilva.png'),
    ('/team_photos/azeda/nunoGouveia.png',             '/team_photos/pontes/nunoGouveia.png'),
    ('/team_photos/sportclubesado/fabioFerreira.png',  '/team_photos/pontes/fabioFerreira.jpg'),
    ('/team_photos/curvas/tiagoMartins.png',           '/team_photos/sportclubesado/tiagoMartins.png')
)
update public.players p
set photo_url = r.new_url
from renames r
where p.photo_url = r.old_url;

-- Confirmar que diz UPDATE 38 antes de fazer commit.
commit;


-- ---------------------------------------------------------------------
-- PARTE 2 — Treinador do Botafogo   *** CONFIRMAR PRIMEIRO ***
-- ---------------------------------------------------------------------
-- O PR apagou public/team_photos/botafogo/treinador/luisMacheta.png e
-- moveu nunoChagas.png de amarelos/treinador/ para botafogo/treinador/.
-- A base de dados diz:
--   Botafogo 2024, 2025 e 2026 -> .../botafogo/treinador/luisMacheta.png
--   Amarelos 2024              -> .../amarelos/treinador/nunoChagas.png
--
-- 2a) Correcao do caminho que mudou de pasta. E segura: mesmo ficheiro.
update public.teams
set manager_photo_url = '/team_photos/botafogo/treinador/nunoChagas.png'
where manager_photo_url = '/team_photos/amarelos/treinador/nunoChagas.png';

-- 2b) O Botafogo 2026 continua a apontar para luisMacheta.png, que ja
--     nao existe no repositorio. SO correr se o Nuno Chagas for de
--     facto o treinador do Botafogo em 2026/27 — confirmar com a
--     direcao, e actualizar tambem teams.manager_name.
--     Deixado comentado de proposito.
--
-- update public.teams t
-- set manager_photo_url = '/team_photos/botafogo/treinador/nunoChagas.png',
--     manager_name      = 'Nuno Chagas'
-- from public.seasons s
-- where s.id = t.season
--   and s.is_current
--   and t.name = 'Botafogo Futebol Clube de Cabanas';


-- ---------------------------------------------------------------------
-- PARTE 3 — Fotos apagadas sem substituto (DECISAO, nada a correr)
-- ---------------------------------------------------------------------
-- 29 caminhos (39 linhas de players) ficaram sem ficheiro. O site nao
-- quebra — o Avatar do MUI mostra o fallback — mas o avatar fica vazio.
--
-- Epoca atual (2026/27), o unico caso:
--   /team_photos/pontes/carlao.jpg      Carlos Coelho (Pontes)
--
-- Epocas antigas (2024/2025), por pasta:
--   aguiassaogabriel/  albertZe, celestinoTavares
--   azeda/             norbertoMunelessa
--   botafogo/          abilioDiniz, carlosGalo, carlosPinela,
--                      diegoSalatiel, fabioVicente, miguelRosario,
--                      pauloMoura, rafaelFerreira, ruiDias
--   pontes/            filipeGalinho, filipePacheco, jailtonFurtado,
--                      joaquimOliveira, luisRodrigues, marioEspada,
--                      pauloBorges, pedroGomes, rafaelSantos,
--                      sergioCarvalho
--   sportclubesado/    brunoCosta, brunoLuz, joaoBaltazar, joaoMonteiro,
--                      ruiRojao, tiagoCortez
--
-- Tres opcoes, por ordem de preferencia:
--   1. repor o PNG antigo no repositorio (reverter a eliminacao no git)
--      — mantem o historico intacto;
--   2. carregar uma foto nova na pasta certa e actualizar o photo_url;
--   3. aceitar o avatar vazio e por photo_url = null, para a base de
--      dados deixar de apontar para ficheiros que nao existem:
--
-- update public.players
-- set photo_url = null
-- where photo_url in ( ... os caminhos acima ... );
--
-- Nota: ha ficheiros com o mesmo nome noutras pastas (por exemplo
-- amarelos/albertZe.png, idolos/celestinoTavares.png,
-- aguiassaogabriel/rafaelFerreira.png, azeda/jailtonFurtado.png,
-- pontes/joaoBaltazar.png, pontes/rafaelSantos.jpg). Podem ser a mesma
-- pessoa noutra epoca — ou um homonimo. Nao estao na PARTE 1
-- precisamente por isso: confirmar um a um antes de reaproveitar.


-- ---------------------------------------------------------------------
-- PARTE 4 — Verificacao final (so leitura)
-- ---------------------------------------------------------------------
-- Nao deve devolver nenhuma linha depois da PARTE 1 e da PARTE 2a.
select 'caminho antigo ainda na BD' as problema, p.id::text as id,
       p.name, p.photo_url as caminho
from public.players p
where p.photo_url in (
  '/team_photos/botafogo/brunoGuilherme.png',
  '/team_photos/botafogo/ermelindoCapelo.png',
  '/team_photos/botafogo/filipeCarvalho.png',
  '/team_photos/botafogo/filipeMartins.png',
  '/team_photos/botafogo/filipePeralta.png',
  '/team_photos/botafogo/joaoFerreira.png',
  '/team_photos/botafogo/joaoLopes.png',
  '/team_photos/botafogo/joaoSousa.png',
  '/team_photos/botafogo/miguelNunes.png',
  '/team_photos/botafogo/ricardoFuzeta.png',
  '/team_photos/botafogo/ricardoLopes.png',
  '/team_photos/botafogo/ricardoMorais.png',
  '/team_photos/botafogo/rubenMartins.png',
  '/team_photos/botafogo/sergioMarta.png',
  '/team_photos/botafogo/tiagoLeandro.png',
  '/team_photos/botafogo/valterBarao.png',
  '/team_photos/aguiassaogabriel/eversonSilva.png',
  '/team_photos/azeda/nunoGouveia.png',
  '/team_photos/sportclubesado/fabioFerreira.png',
  '/team_photos/curvas/tiagoMartins.png'
)
union all
select 'treinador em pasta antiga', t.id::text, t.name, t.manager_photo_url
from public.teams t
where t.manager_photo_url = '/team_photos/amarelos/treinador/nunoChagas.png';

-- Epoca atual: todos os caminhos em uso, para comparar com o
-- repositorio. Esperado: so /team_photos/pontes/carlao.jpg sem
-- ficheiro correspondente.
select p.name, t.name as equipa, p.photo_url
from public.players p
join public.teams t on t.id = p.team_id
join public.seasons s on s.id = t.season and s.is_current
where p.photo_url is not null
order by p.photo_url;
