import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ArrowLeft, Ticket, ExternalLink, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStadiumById } from '@/data/stadiums';
import { getMatchesByStadium, phaseLabels, formatMatchDate } from '@/data/matches';
import { getTeamById } from '@/data/teams';

const StadiumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const stadium = id ? getStadiumById(id) : undefined;
  const matches = stadium ? getMatchesByStadium(stadium.id) : [];

  if (!stadium) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Estádio não encontrado</h1>
          <Link to="/stadiums">
            <Button>Voltar para estádios</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={stadium.image}
          alt={stadium.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Back Button */}
        <Link 
          to="/stadiums"
          className="absolute top-24 left-4 md:left-8"
        >
          <Button variant="outline" className="glass-card">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Stadium Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl">
                {stadium.countryCode === 'USA' ? '🇺🇸' : stadium.countryCode === 'MEX' ? '🇲🇽' : '🇨🇦'}
              </span>
              <span className="px-3 py-1 rounded-full glass-card text-sm">{stadium.country}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl mb-2">{stadium.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span>{stadium.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="font-display text-2xl mb-4">Sobre o Estádio</h2>
              <p className="text-muted-foreground mb-6">{stadium.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold">{stadium.capacity.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground block">Capacidade</span>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <Wrench className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold">{stadium.inaugurationYear}</span>
                  <span className="text-sm text-muted-foreground block">Inauguração</span>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <Calendar className="w-5 h-5 text-primary mb-2" />
                  <span className="text-2xl font-bold">{matches.length}</span>
                  <span className="text-sm text-muted-foreground block">Jogos na Copa</span>
                </div>
              </div>
            </div>

            {/* Sectors */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="font-display text-2xl mb-6">Setores e Preços</h2>
              <div className="space-y-4">
                {stadium.sectors.map((sector) => (
                  <div
                    key={sector.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{sector.name}</h3>
                      <p className="text-sm text-muted-foreground">{sector.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-2xl font-bold text-primary">${sector.price}</span>
                      <span className="text-sm text-muted-foreground block">{sector.capacity.toLocaleString()} lugares</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matches */}
            <div>
              <h2 className="font-display text-2xl mb-6">Jogos neste Estádio</h2>
              {matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.map((match) => {
                    const homeTeam = getTeamById(match.homeTeamId);
                    const awayTeam = getTeamById(match.awayTeamId);

                    if (!homeTeam || !awayTeam) return null;

                    return (
                      <Link
                        key={match.id}
                        to={`/matches/${match.id}`}
                        className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {homeTeam.flag.startsWith('http') ? (
                              <img src={homeTeam.flag} alt={homeTeam.name} className="w-8 h-5 object-cover rounded" />
                            ) : (
                              <span className="text-2xl">{homeTeam.flag}</span>
                            )}
                            <span className="font-medium hidden sm:inline">{homeTeam.code}</span>
                          </div>
                          <span className="text-muted-foreground">vs</span>
                          <div className="flex items-center gap-2">
                            {awayTeam.flag.startsWith('http') ? (
                              <img src={awayTeam.flag} alt={awayTeam.name} className="w-8 h-5 object-cover rounded" />
                            ) : (
                              <span className="text-2xl">{awayTeam.flag}</span>
                            )}
                            <span className="font-medium hidden sm:inline">{awayTeam.code}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">{phaseLabels[match.phase]}</span>
                          <span className="text-sm">{formatMatchDate(match.date)}</span>
                        </div>

                        <Button size="sm" className="gold-gradient hidden sm:flex">
                          <Ticket className="w-4 h-4 mr-1" />
                          Comprar
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum jogo programado ainda.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Stats */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-display text-lg mb-4">Informações Rápidas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">País</span>
                    <span className="font-medium">{stadium.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cidade</span>
                    <span className="font-medium">{stadium.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacidade</span>
                    <span className="font-medium">{stadium.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço mínimo</span>
                    <span className="font-medium text-primary">${stadium.sectors[2]?.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço máximo</span>
                    <span className="font-medium text-primary">${stadium.sectors[0]?.price}</span>
                  </div>
                </div>
              </div>

              {/* Mini-mapa (OpenStreetMap embed) */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="font-display text-lg mb-4">Localização</h3>
                <div className="aspect-square rounded-xl overflow-hidden border border-border/50 relative">
                  <iframe
                    title={`Mapa de ${stadium.name}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      stadium.coordinates.lng - 0.012
                    }%2C${stadium.coordinates.lat - 0.008}%2C${
                      stadium.coordinates.lng + 0.012
                    }%2C${stadium.coordinates.lat + 0.008}&layer=mapnik&marker=${
                      stadium.coordinates.lat
                    }%2C${stadium.coordinates.lng}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-3 text-xs text-muted-foreground text-center font-mono">
                  {stadium.coordinates.lat.toFixed(4)}, {stadium.coordinates.lng.toFixed(4)}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a
                    href={`https://www.google.com/maps?q=${stadium.coordinates.lat},${stadium.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir no Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StadiumDetail;