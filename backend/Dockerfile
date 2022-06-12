FROM continuumio/miniconda:latest

WORKDIR /app

COPY . .

RUN ["chmod", "+x", "./entry.sh"]

RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "covid_safe_buildings_backend", "/bin/bash", "-c"]

ENV PATH /opt/conda/envs/covid_safe_buildings_backend/bin:$PATH

EXPOSE 5001

RUN source activate covid_safe_buildings_backend

ENTRYPOINT ["python"]
CMD ["app.py"]
