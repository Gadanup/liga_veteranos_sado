-- =====================================================================
-- Rollback de docs/db/07_photo_url_fix.sql
-- ---------------------------------------------------------------------
-- So inverte os UPDATEs de texto das PARTES 1 e 2a. Nao ha nada de
-- esquema para desfazer.
--
-- A PARTE 3 (photo_url = null) NAO se desfaz com SQL: os caminhos
-- antigos deixam de existir na base de dados. Repoem-se do dump dos
-- dados. E por isso que o dump tem de estar feito antes de correr a
-- PARTE 3.
--
-- *** LER ANTES DE CORRER ***
-- O rollback NAO pode ser um simples "novo -> antigo". As linhas da
-- epoca atual (2026/27) do Botafogo, mais o Everson Silva, o Nuno
-- Gouveia e o Tiago Martins, JA apontavam para os caminhos novos antes
-- da PARTE 1 — foi por isso que os avatares deles estavam vazios.
-- Inverte-las poria a base de dados pior do que estava.
--
-- Por isso o rollback esta limitado as epocas nao atuais (as 37 linhas
-- de 2024/2025 que a PARTE 1 alterou), mais a unica linha da epoca
-- atual que a PARTE 1 tocou: o Fabio Ferreira, nas Pontes.
--
-- Depois de o PR das fotos estar em main, os ficheiros antigos ja nao
-- existem no repositorio, por isso este rollback volta a por a base de
-- dados a apontar para caminhos inexistentes. So faz sentido se o PR
-- das fotos tambem for revertido.
--
-- Reverter por ordem inversa.
-- =====================================================================

-- PARTE 2a — treinador
update public.teams
set manager_photo_url = '/team_photos/amarelos/treinador/nunoChagas.png'
where manager_photo_url = '/team_photos/botafogo/treinador/nunoChagas.png';

-- PARTE 1 — jogadores
begin;

-- 1a) Epocas nao atuais: esperado UPDATE 37.
with renames(new_url, old_url) as (
  values
    ('/team_photos/botafogo/brunoGuilherme.jpeg',  '/team_photos/botafogo/brunoGuilherme.png'),
    ('/team_photos/botafogo/ermelindoCapelo.jpeg', '/team_photos/botafogo/ermelindoCapelo.png'),
    ('/team_photos/botafogo/filipeCarvalho.jpeg',  '/team_photos/botafogo/filipeCarvalho.png'),
    ('/team_photos/botafogo/filipeMartins.jpeg',   '/team_photos/botafogo/filipeMartins.png'),
    ('/team_photos/botafogo/filipePeralta.jpeg',   '/team_photos/botafogo/filipePeralta.png'),
    ('/team_photos/botafogo/joaoFerreira.jpeg',    '/team_photos/botafogo/joaoFerreira.png'),
    ('/team_photos/botafogo/joaoLopes.jpeg',       '/team_photos/botafogo/joaoLopes.png'),
    ('/team_photos/botafogo/joaoSousa.jpeg',       '/team_photos/botafogo/joaoSousa.png'),
    ('/team_photos/botafogo/miguelNunes.jpeg',     '/team_photos/botafogo/miguelNunes.png'),
    ('/team_photos/botafogo/ricardoFuzeta.jpeg',   '/team_photos/botafogo/ricardoFuzeta.png'),
    ('/team_photos/botafogo/ricardoLopes.jpeg',    '/team_photos/botafogo/ricardoLopes.png'),
    ('/team_photos/botafogo/ricardoMorais.jpeg',   '/team_photos/botafogo/ricardoMorais.png'),
    ('/team_photos/botafogo/rubenMartins.jpeg',    '/team_photos/botafogo/rubenMartins.png'),
    ('/team_photos/botafogo/sergioMarta.jpeg',     '/team_photos/botafogo/sergioMarta.png'),
    ('/team_photos/botafogo/tiagoLeandro.jpeg',    '/team_photos/botafogo/tiagoLeandro.png'),
    ('/team_photos/botafogo/valterBarao.jpeg',     '/team_photos/botafogo/valterBarao.png'),
    ('/team_photos/pontes/eversonSilva.png',         '/team_photos/aguiassaogabriel/eversonSilva.png'),
    ('/team_photos/pontes/nunoGouveia.png',          '/team_photos/azeda/nunoGouveia.png'),
    ('/team_photos/pontes/fabioFerreira.jpg',        '/team_photos/sportclubesado/fabioFerreira.png'),
    ('/team_photos/sportclubesado/tiagoMartins.png', '/team_photos/curvas/tiagoMartins.png')
)
update public.players p
set photo_url = r.old_url
from renames r, public.teams t, public.seasons s
where p.team_id = t.id
  and s.id = t.season
  and not s.is_current
  and p.photo_url = r.new_url;

-- 1b) A unica linha da epoca atual que a PARTE 1 alterou.
--     Esperado UPDATE 1.
update public.players p
set photo_url = '/team_photos/sportclubesado/fabioFerreira.png'
from public.teams t, public.seasons s
where p.team_id = t.id
  and s.id = t.season
  and s.is_current
  and p.photo_url = '/team_photos/pontes/fabioFerreira.jpg';

commit;
