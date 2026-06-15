-- Generado por generate-seed.mjs — NO editar a mano.
-- Datos de ejemplo de La Bandeja. Ejecutar DESPUÉS de schema.sql.

insert into players (id, name, country) values
  ('p-navarro', 'Pablo Cardona', 'ES'),
  ('p-garrido', 'Javi Garrido', 'ES'),
  ('p-gutierrez', 'Juan Tello', 'AR'),
  ('p-campagnolo', 'Tolito Aguirre', 'AR'),
  ('p-momo', 'Momo González', 'ES'),
  ('p-sanchez', 'Álex Ruiz', 'ES'),
  ('p-nieto', 'Miguel Yanguas', 'ES'),
  ('p-diestro', 'Coki Nieto', 'ES'),
  ('p-coello', 'Arturo Coello', 'ES'),
  ('p-tapia', 'Agustín Tapia', 'AR'),
  ('p-lebron', 'Alejandro Galán', 'ES'),
  ('p-chingotto', 'Federico Chingotto', 'AR'),
  ('p-galan', 'Juan Lebrón', 'ES'),
  ('p-stupa', 'Franco Stupaczuk', 'AR'),
  ('p-dinenno', 'Martín Di Nenno', 'AR'),
  ('p-yanguas', 'Jon Sanz', 'ES'),
  ('p-leal', 'Leo Augsburger', 'CL'),
  ('p-ruiz', 'Fede Mouriño', 'AR'),
  ('p-gil', 'Lucas Bergamini', 'BR'),
  ('p-rico', 'Mike Yanguas', 'ES')
on conflict (id) do nothing;

insert into teams (id, player1_id, player2_id) values
  ('tm-cardona-garrido', 'p-navarro', 'p-garrido'),
  ('tm-tello-aguirre', 'p-gutierrez', 'p-campagnolo'),
  ('tm-momo-ruiz', 'p-momo', 'p-sanchez'),
  ('tm-yanguas-nieto', 'p-nieto', 'p-diestro'),
  ('tm-coello-tapia', 'p-coello', 'p-tapia'),
  ('tm-galan-chingo', 'p-lebron', 'p-chingotto'),
  ('tm-lebron-stupa', 'p-galan', 'p-stupa'),
  ('tm-dinenno-sanz', 'p-dinenno', 'p-yanguas'),
  ('tm-augs-mourino', 'p-leal', 'p-ruiz'),
  ('tm-bergamini-rico', 'p-gil', 'p-rico')
on conflict (id) do nothing;

insert into tournaments (id, name, location, start_date, end_date, category, status) values
  ('t-madrid', 'Madrid P1 Premier Padel', 'Madrid, España', '2026-06-09', '2026-06-15', 'P1000', 'ongoing'),
  ('t-roma', 'Roma Major', 'Roma, Italia', '2026-06-16', '2026-06-22', 'Major', 'upcoming'),
  ('t-bordeaux', 'Bordeaux P2', 'Burdeos, Francia', '2026-06-23', '2026-06-29', 'P500', 'upcoming'),
  ('t-bsas', 'Buenos Aires P2', 'Buenos Aires, Argentina', '2026-07-07', '2026-07-13', 'P500', 'upcoming'),
  ('t-malaga', 'Málaga P1', 'Málaga, España', '2026-06-02', '2026-06-08', 'P1000', 'finished'),
  ('t-mexico', 'Acapulco Open', 'Acapulco, México', '2026-05-26', '2026-06-01', 'Open', 'finished')
on conflict (id) do nothing;

insert into matches (id, start_time, tournament_name, round, court, status, sets, team_a_id, team_b_id, winner_team_id) values
  ('m-101', '2026-06-14T11:00:00', 'Madrid P1 Premier Padel', 'Cuartos de final', 'Central', 'finished', '[[6,3],[6,4]]'::jsonb, 'tm-cardona-garrido', 'tm-tello-aguirre', 'tm-cardona-garrido'),
  ('m-102', '2026-06-14T12:30:00', 'Madrid P1 Premier Padel', 'Cuartos de final', 'Pista 2', 'finished', '[[7,5],[6,4]]'::jsonb, 'tm-momo-ruiz', 'tm-yanguas-nieto', 'tm-momo-ruiz'),
  ('m-103', '2026-06-14T16:00:00', 'Madrid P1 Premier Padel', 'Semifinal', 'Central', 'live', '[[6,4],[3,4]]'::jsonb, 'tm-coello-tapia', 'tm-galan-chingo', null),
  ('m-104', '2026-06-14T17:30:00', 'Madrid P1 Premier Padel', 'Semifinal', 'Pista 2', 'live', '[[5,5]]'::jsonb, 'tm-lebron-stupa', 'tm-dinenno-sanz', null),
  ('m-105', '2026-06-14T19:30:00', 'Madrid P1 Premier Padel', 'Consolación', 'Pista 3', 'upcoming', '[]'::jsonb, 'tm-augs-mourino', 'tm-bergamini-rico', null),
  ('m-106', '2026-06-14T21:00:00', 'Madrid P1 Premier Padel', 'Exhibición', 'Central', 'upcoming', '[]'::jsonb, 'tm-tello-aguirre', 'tm-yanguas-nieto', null),
  ('m-201', '2026-06-13T18:00:00', 'Madrid P1 Premier Padel', 'Octavos de final', null, 'finished', '[[6,2],[6,1]]'::jsonb, 'tm-coello-tapia', 'tm-augs-mourino', 'tm-coello-tapia'),
  ('m-202', '2026-06-13T16:30:00', 'Madrid P1 Premier Padel', 'Octavos de final', null, 'finished', '[[6,4],[7,6]]'::jsonb, 'tm-galan-chingo', 'tm-bergamini-rico', 'tm-galan-chingo'),
  ('m-203', '2026-06-13T15:00:00', 'Madrid P1 Premier Padel', 'Octavos de final', null, 'finished', '[[7,5],[4,6],[6,3]]'::jsonb, 'tm-lebron-stupa', 'tm-momo-ruiz', 'tm-lebron-stupa'),
  ('m-204', '2026-06-13T13:30:00', 'Madrid P1 Premier Padel', 'Octavos de final', null, 'finished', '[[6,3],[6,7],[7,5]]'::jsonb, 'tm-dinenno-sanz', 'tm-yanguas-nieto', 'tm-dinenno-sanz'),
  ('m-205', '2026-06-13T12:00:00', 'Madrid P1 Premier Padel', 'Octavos de final', null, 'finished', '[[6,4],[6,4]]'::jsonb, 'tm-cardona-garrido', 'tm-augs-mourino', 'tm-cardona-garrido'),
  ('m-206', '2026-06-13T10:30:00', 'Madrid P1 Premier Padel', 'Octavos de final', null, 'finished', '[[7,6],[6,4]]'::jsonb, 'tm-tello-aguirre', 'tm-bergamini-rico', 'tm-tello-aguirre'),
  ('m-207', '2026-06-12T18:00:00', 'Madrid P1 Premier Padel', 'Dieciseisavos', null, 'finished', '[[6,1],[6,2]]'::jsonb, 'tm-coello-tapia', 'tm-yanguas-nieto', 'tm-coello-tapia'),
  ('m-208', '2026-06-12T16:30:00', 'Madrid P1 Premier Padel', 'Dieciseisavos', null, 'finished', '[[6,3],[6,4]]'::jsonb, 'tm-galan-chingo', 'tm-momo-ruiz', 'tm-galan-chingo'),
  ('m-209', '2026-06-12T15:00:00', 'Madrid P1 Premier Padel', 'Dieciseisavos', null, 'finished', '[[6,2],[7,5]]'::jsonb, 'tm-lebron-stupa', 'tm-tello-aguirre', 'tm-lebron-stupa'),
  ('m-210', '2026-06-12T13:30:00', 'Madrid P1 Premier Padel', 'Dieciseisavos', null, 'finished', '[[6,4],[3,6],[6,2]]'::jsonb, 'tm-dinenno-sanz', 'tm-bergamini-rico', 'tm-dinenno-sanz'),
  ('m-211', '2026-06-11T18:30:00', 'Madrid P1 Premier Padel', 'Primera ronda', null, 'finished', '[[7,6],[6,7],[7,5]]'::jsonb, 'tm-cardona-garrido', 'tm-yanguas-nieto', 'tm-cardona-garrido'),
  ('m-212', '2026-06-11T17:00:00', 'Madrid P1 Premier Padel', 'Primera ronda', null, 'finished', '[[6,4],[6,3]]'::jsonb, 'tm-momo-ruiz', 'tm-augs-mourino', 'tm-momo-ruiz'),
  ('m-213', '2026-06-11T15:30:00', 'Madrid P1 Premier Padel', 'Primera ronda', null, 'finished', '[[6,4],[6,2]]'::jsonb, 'tm-tello-aguirre', 'tm-yanguas-nieto', 'tm-tello-aguirre'),
  ('m-214', '2026-06-08T19:00:00', 'Málaga P1', 'Final', null, 'finished', '[[6,4],[4,6],[6,3]]'::jsonb, 'tm-coello-tapia', 'tm-lebron-stupa', 'tm-coello-tapia'),
  ('m-215', '2026-06-08T17:00:00', 'Málaga P1', 'Semifinal', null, 'finished', '[[7,5],[6,4]]'::jsonb, 'tm-galan-chingo', 'tm-dinenno-sanz', 'tm-galan-chingo'),
  ('m-216', '2026-06-07T18:00:00', 'Málaga P1', 'Cuartos de final', null, 'finished', '[[6,3],[7,6]]'::jsonb, 'tm-cardona-garrido', 'tm-momo-ruiz', 'tm-cardona-garrido'),
  ('m-217', '2026-06-07T16:00:00', 'Málaga P1', 'Cuartos de final', null, 'finished', '[[4,6],[6,3],[6,4]]'::jsonb, 'tm-augs-mourino', 'tm-tello-aguirre', 'tm-augs-mourino'),
  ('m-301', '2026-06-15T18:00:00', 'Madrid P1 Premier Padel', 'Final', 'Central', 'upcoming', '[]'::jsonb, 'tm-coello-tapia', 'tm-lebron-stupa', null),
  ('m-302', '2026-06-15T16:00:00', 'Madrid P1 Premier Padel', 'Final femenina', 'Central', 'upcoming', '[]'::jsonb, 'tm-cardona-garrido', 'tm-momo-ruiz', null),
  ('m-303', '2026-06-16T12:00:00', 'Roma Major', 'Primera ronda', null, 'upcoming', '[]'::jsonb, 'tm-dinenno-sanz', 'tm-tello-aguirre', null),
  ('m-304', '2026-06-16T14:00:00', 'Roma Major', 'Primera ronda', null, 'upcoming', '[]'::jsonb, 'tm-galan-chingo', 'tm-bergamini-rico', null),
  ('m-305', '2026-06-17T13:00:00', 'Roma Major', 'Primera ronda', null, 'upcoming', '[]'::jsonb, 'tm-coello-tapia', 'tm-augs-mourino', null),
  ('m-306', '2026-06-17T15:30:00', 'Roma Major', 'Primera ronda', null, 'upcoming', '[]'::jsonb, 'tm-lebron-stupa', 'tm-yanguas-nieto', null)
on conflict (id) do nothing;

insert into rankings (position, player_id, points, movement) values
  (1, 'p-coello', 14250, 0),
  (2, 'p-tapia', 13980, 0),
  (3, 'p-galan', 11540, 1),
  (4, 'p-lebron', 11320, -1),
  (5, 'p-chingotto', 10870, 2),
  (6, 'p-stupa', 10410, -1),
  (7, 'p-dinenno', 9560, -1),
  (8, 'p-yanguas', 8990, 1),
  (9, 'p-navarro', 8740, -1),
  (10, 'p-garrido', 8120, 0),
  (11, 'p-momo', 7650, 3),
  (12, 'p-leal', 7430, -1),
  (13, 'p-ruiz', 7180, 1),
  (14, 'p-gil', 6890, -2),
  (15, 'p-sanchez', 6540, 0),
  (16, 'p-nieto', 6310, 1),
  (17, 'p-campagnolo', 6020, -1),
  (18, 'p-gutierrez', 5870, 2),
  (19, 'p-diestro', 5610, -1),
  (20, 'p-rico', 5390, 0)
on conflict (position) do nothing;
